# Index Comparison

## 1. 初期化

```powershell
psql -d studyweb -f db/schema.sql
psql -d studyweb -f db/seed.sql
psql -d studyweb -c "analyze products;"
```

## 2. Indexなし

```powershell
psql -d studyweb -c "explain (analyze, buffers) select * from products where name = 'product-9999';"
```

scan method、estimated / actual rows、planning time、execution time、buffersを記録する。

## 3. Indexあり

```powershell
psql -d studyweb -c "create index idx_products_name on products(name);"
psql -d studyweb -c "analyze products;"
psql -d studyweb -c "explain (analyze, buffers) select * from products where name = 'product-9999';"
```

同じ項目を記録し、planを比較する。

## 4. 後片付け・再比較

```powershell
psql -d studyweb -c "drop index if exists idx_products_name;"
```

学習用DBでのみ実行する。schema.sqlはproducts tableをdropするため、共有・本番DBへ向けない。
