# db02 SQL CRUDとスキーマ基礎

共通PostgreSQL環境を使って、CRUD、制約、JOIN、制約違反を確認する教材です。すべてリポジトリルートから実行します。

## 起動と実行順

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml up -d --wait --wait-timeout 30 db
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\001_schema.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\002_seed.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\003_crud_examples.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\004_join_examples.sql
```

`005_constraint_errors.sql` は意図的にエラーを起こします。内容を読み、1ケースずつ手動で試して、守られた制約を記録してください。

自動検証だけを実行する場合:

```cmd
node StudyDB\scripts\validate-studydb.mjs db02
```

停止時は `docker compose -f StudyDB\src\apps\common\docker-compose.yml down` を実行します。
