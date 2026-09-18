-- Data-validation queries for shop.db
-- Each query returns rows ONLY when there is a problem — an empty result = PASS.
-- Run all:  sqlite3 shop.db < queries/data-validation.sql
-- Scenarios: ../test-scenarios/SC-SQL-data-validation.md

.headers on
.mode column

-- V1: Duplicate customer emails (unique-ness) -----------------------------
SELECT '--- V1 duplicate emails ---' AS check_name;
SELECT email, COUNT(*) AS occurrences
FROM customers
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;

-- V2: Missing required fields (NOT NULL/empty email) ----------------------
SELECT '--- V2 missing email ---' AS check_name;
SELECT id, name
FROM customers
WHERE email IS NULL OR TRIM(email) = '';

-- V3: Invalid product price (must be > 0) ---------------------------------
SELECT '--- V3 non-positive price ---' AS check_name;
SELECT id, name, price
FROM products
WHERE price <= 0;

-- V4: Invalid stock (must be >= 0) ----------------------------------------
SELECT '--- V4 negative stock ---' AS check_name;
SELECT id, name, stock
FROM products
WHERE stock < 0;

-- V5: Orders referencing a non-existent customer (referential integrity) --
SELECT '--- V5 orphan orders ---' AS check_name;
SELECT o.id AS order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id
WHERE c.id IS NULL;

-- V6: Order items referencing a non-existent product ----------------------
SELECT '--- V6 orphan order_items (product) ---' AS check_name;
SELECT oi.id AS item_id, oi.order_id, oi.product_id
FROM order_items oi
LEFT JOIN products p ON p.id = oi.product_id
WHERE p.id IS NULL;

-- V7: Non-positive quantities ---------------------------------------------
SELECT '--- V7 non-positive quantity ---' AS check_name;
SELECT id AS item_id, order_id, product_id, quantity
FROM order_items
WHERE quantity <= 0;

-- V8: Order total mismatch vs sum of its items ----------------------------
SELECT '--- V8 total mismatch ---' AS check_name;
SELECT o.id AS order_id,
       o.total AS recorded_total,
       ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0), 2) AS computed_total
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.total
HAVING ROUND(o.total, 2) <> ROUND(COALESCE(SUM(oi.quantity * oi.unit_price), 0), 2);
