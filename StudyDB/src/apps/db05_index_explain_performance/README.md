# db05 index・EXPLAIN・性能確認

共通PostgreSQL環境を使って、index作成前後の実行計画を比較する教材です。すべてリポジトリルートから実行します。

## 実行順

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml up -d --wait --wait-timeout 30 db
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\001_schema.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\002_seed_small.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\003_seed_large.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\004_explain_without_index.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\005_create_indexes.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\006_explain_with_index.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\007_ineffective_index_examples.sql
```

実行時間は環境差が出るため、絶対値ではなくscan方式、推定行数と実測行数、filter、planの変化を比較します。

自動検証は `node StudyDB\scripts\validate-studydb.mjs db05`、環境の停止は `docker compose -f StudyDB\src\apps\common\docker-compose.yml down` です。
