# db05 index / EXPLAIN / 性能確認
共通DB構成を使って、indexあり/なしの実行計画と検索傾向を比較する教材。
## 実行順
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db05 sql\001_schema.sql
scripts\run-sql.cmd db05 sql\002_seed_small.sql
scripts\run-sql.cmd db05 sql\003_seed_large.sql
scripts\run-sql.cmd db05 sql\004_explain_without_index.sql
scripts\run-sql.cmd db05 sql\005_create_indexes.sql
scripts\run-sql.cmd db05 sql\006_explain_with_index.sql
scripts\run-sql.cmd db05 sql\007_ineffective_index_examples.sql
```

実行時間は環境差が出るため、絶対値ではなく plan の変化と傾向を見る。
