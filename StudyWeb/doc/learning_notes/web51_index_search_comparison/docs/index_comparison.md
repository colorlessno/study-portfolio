# Index Comparison

1. indexなしで `explain analyze select * from products where name = 'product-9999';`
2. `idx_products_name` を作成
3. 同じSQLを再実行
