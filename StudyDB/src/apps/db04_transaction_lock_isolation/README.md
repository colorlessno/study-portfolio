# db04 トランザクション・ロック・分離レベル

共通PostgreSQL環境を使って、commit、rollback、同時更新、lock waitを観察する教材です。すべてリポジトリルートから実行します。

## 基本動作

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml up -d --wait --wait-timeout 30 db
StudyDB\src\apps\common\scripts\run-sql.cmd db04 sql\001_schema.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db04 sql\002_seed.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db04 sql\003_commit_rollback.sql
```

## 同時更新

2つのターミナルで次のコマンドを実行し、それぞれpsqlを開きます。

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml exec db psql -U postgres -d studydb
```

session Aで次を実行します。

```text
\i /work/db04_transaction_lock_isolation/sql/004_concurrent_update_session_a.sql
```

続けてsession Bで次を実行し、5秒後にlock timeoutになることを確認します。

```text
\i /work/db04_transaction_lock_isolation/sql/005_concurrent_update_session_b.sql
```

session Aは必ず `ROLLBACK;` または `COMMIT;` で終えます。放置時も60秒で接続が終了する安全制限を設定していますが、制限へ頼らず手動で終了してください。

自動検証は `node StudyDB\scripts\validate-studydb.mjs db04`、環境の停止は `docker compose -f StudyDB\src\apps\common\docker-compose.yml down` です。
