# StudyDB common DB

`StudyDB db02、db04、db05、db06` で共通利用する PostgreSQL 教材環境。
db01、db03、db07 は文書・サンプル中心の教材であり、この共通SQL実行入口の対象外とする。
## 方針
- service名は `db`。
- databaseは `studydb`。
- user/passwordは教材用固定値 `postgres/postgres`。
- volumeは `studydb_db`。
- PowerShell script は使わず、DOS窓で使える `.cmd` を実行入口にする。
## 起動
```cmd
cd .\src\apps\common
docker compose up -d db
docker compose ps
```

## SQL実行
```cmd
scripts\run-sql.cmd db02 sql\001_schema.sql
scripts\run-sql.cmd db02 sql\002_seed.sql
```

引数1は `apps` 配下の教材番号、引数2は教材フォルダからの相対SQLパス。
## 停止

```cmd
docker compose down
```

volumeも消す場合だけ次を使う。
```cmd
docker compose down -v
```
