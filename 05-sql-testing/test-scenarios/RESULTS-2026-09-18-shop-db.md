# SQL Execution Report — Data Validation (shop.db)

| Field | Value |
|-------|-------|
| **Report ID** | TER-005 |
| **Database** | `shop.db` (SQLite 3.51) built from [`../schema.sql`](../schema.sql) |
| **Scenarios** | [SC-SQL-data-validation.md](SC-SQL-data-validation.md) |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-18 |

## Summary
The seeded database intentionally contains data-quality problems. All 8 validation checks ran and
**correctly detected every seeded issue** — plus two cascading effects on order totals that weren't
obvious from the seed alone.

| Check | Description | Issues found | Detected? |
|-------|-------------|--------------|-----------|
| V1 | Duplicate emails | `alice@example.com` used by customers 1 & 5 | ✅ |
| V2 | Missing email | customer 6 (Frank Uy) | ✅ |
| V3 | Non-positive price | product 4 (Doohickey, -2.00) | ✅ |
| V4 | Negative stock | product 5 (Sprocket, -5) | ✅ |
| V5 | Orphan orders | order 4 → customer 99 (does not exist) | ✅ |
| V6 | Orphan order items | item 5 → product 999 (does not exist) | ✅ |
| V7 | Non-positive quantity | item 6 (quantity -1) | ✅ |
| V8 | Order total mismatch | orders 1, 2, **and** 3 | ✅ |

## Notable finding — cascading data corruption (V8)
Only order 3 was seeded with an obviously wrong total. But V8 flagged **three** orders, revealing
that the other defects corrupt totals downstream:

| Order | Recorded total | Computed from items | Root cause |
|-------|----------------|---------------------|------------|
| 1 | 29.97 | **34.97** | orphan item 5 (product 999, +5.00) inflates the computed total |
| 2 | 19.99 | **15.00** | negative quantity in item 6 (-1 × 4.99) reduces the computed total |
| 3 | 100.00 | 19.98 | seeded mismatch (total never matched its items) |

**Lesson:** a single bad row (an orphan item, a negative quantity) doesn't stay contained — it
propagates into aggregate/reconciliation checks. This is exactly why a cross-table consistency check
(V8) is valuable: it catches the *symptom* even when the root cause is a different table.

## Analytics query results (sanity)
| Report | Result |
|--------|--------|
| A1 revenue per customer | Alice 34.97, Carol 19.98, Bob 15.00 (reflects the corrupted item data — matches V8) |
| A2 top products by units | Widget 6, Gadget 1 (negative-qty row excluded by `quantity > 0`) |
| A3 customers with no orders | Dave, Eve, Frank |
| A4 order value summary | 4 orders, avg 39.99, min 9.99, max 100.00 |

## How to reproduce
```bash
cd 05-sql-testing
sqlite3 shop.db < schema.sql
sqlite3 shop.db < queries/data-validation.sql
sqlite3 shop.db < queries/analytics.sql
```

## Takeaways
- Empty-result-means-pass is a clean pattern for data-validation checks (easy to wire into CI/alerts).
- Referential-integrity gaps show up because FKs weren't enforced — a real fix is to enforce foreign
  keys (`PRAGMA foreign_keys = ON`) and add constraints/CHECKs so bad data can't be inserted at all.
- Reconciliation checks (stored vs computed) catch corruption regardless of which table caused it.
