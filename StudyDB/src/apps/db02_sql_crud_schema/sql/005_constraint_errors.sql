SET search_path TO db02;

-- Run one statement at a time if you want to inspect each error.

INSERT INTO customers (name, email)
VALUES ('Duplicate Email', 'customer-a@example.test');

INSERT INTO customers (name, email)
VALUES (NULL, 'missing-name@example.test');

INSERT INTO orders (customer_id, status)
VALUES (999, 'created');

INSERT INTO products (name, price)
VALUES ('Invalid Price', -1);

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 0, 800.00);

