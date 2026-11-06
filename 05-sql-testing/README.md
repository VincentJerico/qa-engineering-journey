# SQL Testing

Backend / data-validation testing practice using a self-contained SQLite database. No external
service needed — the database is rebuilt from `schema.sql`.

## Contents
```
05-sql-testing/
├── check.sh                         # CI gate: rebuild + diff against expected/
├── selftest.sh                      # proves check.sh fails on planted defects
├── expected/                        # golden query output (the defects the checks must catch)
├── schema.sql                       # schema + seed data (with deliberate data-quality issues)
├── queries/
│   ├── data-validation.sql          # V1..V8 checks (empty result = PASS)
│   └── analytics.sql                # JOIN / aggregation reporting queries
└── test-scenarios/
    ├── SC-SQL-data-validation.md    # scenario definitions
    └── RESULTS-2026-09-18-shop-db.md # execution report (TER-005)
```

## Quick start
```bash
cd 05-sql-testing
sqlite3 shop.db < schema.sql              # build the database
sqlite3 -header -column shop.db < queries/data-validation.sql
sqlite3 -header -column shop.db < queries/analytics.sql
```

`./check.sh` rebuilds the database in a temp dir, runs both query files, and diffs the output
against `expected/*.csv`. CI runs it on every push. After an intentional change to the seed or
a query, run `./check.sh --update` and review the diff to `expected/`.

`./selftest.sh` runs first in CI and proves the gate can fail. In temporary copies it plants a
changed value, a missing row, a query with a syntax error, and a failing query whose expected output
is also empty. That last one only fails if sqlite errors stop the run, so it guards against errors
being swallowed. `check.sh` strips carriage returns from sqlite's CSV output, because macOS builds
end rows with CRLF and Linux builds with LF.

`shop.db` is a build artifact (git-ignored) — regenerate it any time from `schema.sql`.

## What it demonstrates
- **Data-validation techniques:** uniqueness, required fields, range/business rules, referential
  integrity, and cross-table reconciliation (stored total vs computed total).
- **The "empty result = PASS" pattern** for validation checks — easy to automate/alert on.
- **Reporting SQL:** JOINs, `GROUP BY` aggregation, and LEFT-JOIN anti-joins.

The seed data intentionally contains 7+ defects so the checks have something to catch; see the
execution report for what was found (including a cascading order-total corruption).

## Schema
`customers` → `orders` → `order_items` ← `products` (a minimal e-commerce model).
Foreign keys are intentionally left unenforced so referential-integrity gaps can be seeded and
detected; a production fix would enforce them plus `CHECK` constraints.
