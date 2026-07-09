# db04 トランザクション・ロック・分離レベル

commit、rollback、lock wait、分離レベルを観察する。
## 実行
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db04 sql\001_schema.sql
scripts\run-sql.cmd db04 sql\002_seed.sql
scripts\run-sql.cmd db04 sql\003_commit_rollback.sql
```
