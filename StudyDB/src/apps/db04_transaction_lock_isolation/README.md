# db04 トランザクション・ロック・分離レベル

共通DB構成を使って、commit、rollback、同時更新、lock waitを観察する教材。
## 実行順
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db04 sql\001_schema.sql
scripts\run-sql.cmd db04 sql\002_seed.sql
scripts\run-sql.cmd db04 sql\003_commit_rollback.sql
```

同時更新は2つのDOS窓で `docker compose exec db psql -U postgres -d studydb` を開き、session A/B のSQLを手で実行する。
