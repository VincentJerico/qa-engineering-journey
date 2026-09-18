-- Analytics / reporting queries for shop.db (JOINs and aggregation practice).
-- Run all:  sqlite3 shop.db < queries/analytics.sql

.headers on
.mode column

-- A1: Revenue per customer (only valid orders with a real customer) --------
SELECT '--- A1 revenue per customer ---' AS report;
SELECT c.id, c.name,
       COUNT(DISTINCT o.id)              AS orders,
       ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.id, c.name
ORDER BY revenue DESC;

-- A2: Top products by units sold (valid products only) --------------------
SELECT '--- A2 top products by units ---' AS report;
SELECT p.id, p.name,
       SUM(oi.quantity) AS units_sold
FROM products p
JOIN order_items oi ON oi.product_id = p.id
WHERE oi.quantity > 0
GROUP BY p.id, p.name
ORDER BY units_sold DESC;

-- A3: Customers with no orders (LEFT JOIN / anti-join) --------------------
SELECT '--- A3 customers with no orders ---' AS report;
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- A4: Order count and average order value ---------------------------------
SELECT '--- A4 order value summary ---' AS report;
SELECT COUNT(*)                    AS order_count,
       ROUND(AVG(total), 2)        AS avg_order_value,
       ROUND(MIN(total), 2)        AS min_total,
       ROUND(MAX(total), 2)        AS max_total
FROM orders;
