# db02 SQL CRUD とスキーマ基礎
共通DBを使ってCRUD、JOIN、制約違反を確認する。
## 実行
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db02 sql\001_schema.sql
scripts\run-sql.cmd db02 sql\002_seed.sql
scripts\run-sql.cmd db02 sql\003_crud_examples.sql
scripts\run-sql.cmd db02 sql\004_join_examples.sql
```

結果は `docs/command_log.md` に記録する。
