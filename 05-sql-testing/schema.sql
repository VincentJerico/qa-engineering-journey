-- Sample e-commerce database for SQL data-validation practice.
-- Rebuild:  sqlite3 shop.db < schema.sql
--
-- NOTE: foreign keys are intentionally NOT enforced here so the seed data can
-- contain referential-integrity problems for the validation queries to catch.
-- The seed deliberately includes 7 data-quality issues (see DATA-ISSUES below).

PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT,
  created_at TEXT    NOT NULL
);

CREATE TABLE products (
  id    INTEGER PRIMARY KEY,
  name  TEXT    NOT NULL,
  price REAL    NOT NULL,
  stock INTEGER NOT NULL
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date  TEXT    NOT NULL,
  total       REAL    NOT NULL
);

CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY,
  order_id   INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity   INTEGER NOT NULL,
  unit_price REAL    NOT NULL
);

-- ---------------------------------------------------------------------------
-- Customers  (issue: id 5 duplicate email; id 6 NULL email)
-- ---------------------------------------------------------------------------
INSERT INTO customers (id, name, email, created_at) VALUES
  (1, 'Alice Reyes',  'alice@example.com', '2026-01-05'),
  (2, 'Bob Santos',   'bob@example.com',   '2026-01-09'),
  (3, 'Carol Cruz',   'carol@example.com', '2026-02-01'),
  (4, 'Dave Lim',     'dave@example.com',  '2026-02-14'),
  (5, 'Eve Tan',      'alice@example.com', '2026-03-02'),  -- ISSUE #1 duplicate email
  (6, 'Frank Uy',     NULL,                '2026-03-10');  -- ISSUE #2 null required email

-- ---------------------------------------------------------------------------
-- Products  (issue: id 4 negative price; id 5 negative stock)
-- ---------------------------------------------------------------------------
INSERT INTO products (id, name, price, stock) VALUES
  (1, 'Widget',    9.99,  100),
  (2, 'Gadget',   19.99,   50),
  (3, 'Gizmo',     4.99,    0),
  (4, 'Doohickey', -2.00,  10),  -- ISSUE #3 negative price
  (5, 'Sprocket', 14.99,   -5);  -- ISSUE #4 negative stock

-- ---------------------------------------------------------------------------
-- Orders  (issue: order 3 total mismatch; order 4 orphan customer 99)
-- ---------------------------------------------------------------------------
INSERT INTO orders (id, customer_id, order_date, total) VALUES
  (1, 1,  '2026-03-01', 29.97),
  (2, 2,  '2026-03-05', 19.99),
  (3, 3,  '2026-03-06', 100.00), -- ISSUE #5 total != sum(items) (items = 19.98)
  (4, 99, '2026-03-07', 9.99);   -- ISSUE #6 customer 99 does not exist

-- ---------------------------------------------------------------------------
-- Order items (issue: oi5 orphan product 999; oi6 negative quantity)
-- ---------------------------------------------------------------------------
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1,  3,  9.99),   -- order 1: 3 x 9.99 = 29.97  (matches)
  (2, 2, 2,  1, 19.99),   -- order 2: 1 x 19.99 = 19.99 (matches)
  (3, 3, 1,  2,  9.99),   -- order 3: 2 x 9.99 = 19.98  (order.total says 100.00)
  (4, 4, 1,  1,  9.99),   -- order 4: belongs to orphan customer
  (5, 1, 999, 1,  5.00),  -- ISSUE #7 product 999 does not exist
  (6, 2, 3, -1,  4.99);   -- ISSUE (bonus) negative quantity

-- DATA-ISSUES (intentional) for the validation queries to catch:
--   1. Duplicate email (alice@example.com used by customers 1 and 5)
--   2. NULL email on customer 6
--   3. Negative product price (product 4)
--   4. Negative product stock (product 5)
--   5. Order total mismatch (order 3)
--   6. Orphan order -> non-existent customer 99 (order 4)
--   7. Orphan order_item -> non-existent product 999 (item 5)
--   +  Negative quantity (item 6)
