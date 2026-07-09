# db06 バックアップ・リストア・マイグレーション安全性

共通DB構成を使って、backup、restore、migration前後確認を学ぶ教材。
## 実行順
```cmd
cd .\src\apps\common
docker compose up -d db
scripts\run-sql.cmd db06 sql\001_schema.sql
scripts\run-sql.cmd db06 sql\002_seed.sql
scripts\run-sql.cmd db06 sql\checks\001_before_migration_check.sql
```

## backup / restore

ダンプは「schema `db06` を作り直す」内容のため、**元と同じDBに流すと既存の db06 と衝突する**。
復元確認は別データベース `studydb_restore` に対して行う（2026-07-09 手順修正）。

```cmd
docker compose exec db pg_dump -U postgres -d studydb --schema=db06 --file=/backups/studydb_db06_before_migration.sql
docker compose exec db psql -U postgres -c "DROP DATABASE IF EXISTS studydb_restore;"
docker compose exec db psql -U postgres -c "CREATE DATABASE studydb_restore;"
docker compose exec db psql -U postgres -d studydb_restore -f /backups/studydb_db06_before_migration.sql
docker compose exec db psql -U postgres -d studydb_restore -c "SELECT count(*) AS restored_customers FROM db06.customers;"
```

最後の SELECT で `restored_customers = 3`（seed 直後にバックアップした場合）が返れば、復元成功。

backupファイルは生成物なのでgit管理外にする。
## migration

```cmd
scripts\run-sql.cmd db06 sql\migrations\001_add_customer_email.sql
scripts\run-sql.cmd db06 sql\migrations\002_add_order_status.sql
scripts\run-sql.cmd db06 sql\checks\002_after_migration_check.sql
```
