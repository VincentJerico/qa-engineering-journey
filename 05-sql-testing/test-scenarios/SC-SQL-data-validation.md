# SQL Test Scenarios — Data Validation (shop.db)

| Field | Value |
|-------|-------|
| **Database** | `shop.db` (SQLite) — built from [`../schema.sql`](../schema.sql) |
| **Queries** | [`../queries/data-validation.sql`](../queries/data-validation.sql) |
| **Author** | Vincent Jerico |
| **Date** | 2026-09-18 |

**Convention:** each validation query returns rows **only when there is a problem**.
An **empty result = PASS**; any rows returned = the check found data-quality issues.

---

### SC-SQL-001 — Unique customer emails
**Check (V1):** no email appears more than once.
| Assertion | Expected on clean data |
|-----------|------------------------|
| Rows returned | 0 |
**Technique:** uniqueness / duplicate detection (`GROUP BY … HAVING COUNT(*) > 1`).

### SC-SQL-002 — Required email present
**Check (V2):** every customer has a non-null, non-empty email.
| Assertion | Expected | Rows = 0 |
**Technique:** NOT NULL / required-field validation.

### SC-SQL-003 — Product price is positive
**Check (V3):** `price > 0` for all products.
**Technique:** business-rule / range validation.

### SC-SQL-004 — Stock is non-negative
**Check (V4):** `stock >= 0` for all products.
**Technique:** boundary / range validation.

### SC-SQL-005 — Orders reference an existing customer
**Check (V5):** every `orders.customer_id` exists in `customers` (LEFT JOIN anti-join).
**Technique:** referential integrity.

### SC-SQL-006 — Order items reference an existing product
**Check (V6):** every `order_items.product_id` exists in `products`.
**Technique:** referential integrity.

### SC-SQL-007 — Quantities are positive
**Check (V7):** `quantity > 0` for all order items.
**Technique:** business-rule validation.

### SC-SQL-008 — Order total matches the sum of its items
**Check (V8):** `orders.total == SUM(order_items.quantity * unit_price)` per order.
**Technique:** cross-table consistency / computed-vs-stored reconciliation.

---

## Analytics scenarios (correctness of reporting queries)
See [`../queries/analytics.sql`](../queries/analytics.sql).

| ID | Query | What it validates |
|----|-------|-------------------|
| SC-SQL-010 | A1 revenue per customer | JOIN + SUM aggregation is correct |
| SC-SQL-011 | A2 top products by units | GROUP BY + ordering; excludes negative qty |
| SC-SQL-012 | A3 customers with no orders | LEFT JOIN anti-join finds the right set |
| SC-SQL-013 | A4 order value summary | COUNT/AVG/MIN/MAX aggregates |

## Notes
- On the seeded database these checks are **expected to find issues** (the seed contains deliberate
  data-quality problems). On production-clean data they should all return 0 rows.
- Results recorded in [RESULTS-2026-09-18-shop-db.md](RESULTS-2026-09-18-shop-db.md).
