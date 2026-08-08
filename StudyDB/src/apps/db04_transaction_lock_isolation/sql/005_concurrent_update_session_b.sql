SET search_path TO db04;
SET lock_timeout = '5s';

BEGIN;
UPDATE products
SET stock = stock - 1, updated_at = now()
WHERE id = 1
RETURNING id, name, stock;

COMMIT;
