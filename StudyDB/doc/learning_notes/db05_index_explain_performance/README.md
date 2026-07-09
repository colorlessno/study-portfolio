# db05 index / EXPLAIN / 性能確認
indexあり/なしで実行計画がどう変わるか観察する。
## 実行
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db05 sql\001_schema.sql
scripts\run-sql.cmd db05 sql\002_seed_small.sql
scripts\run-sql.cmd db05 sql\003_seed_large.sql
scripts\run-sql.cmd db05 sql\004_explain_without_index.sql
scripts\run-sql.cmd db05 sql\005_create_indexes.sql
scripts\run-sql.cmd db05 sql\006_explain_with_index.sql
```
