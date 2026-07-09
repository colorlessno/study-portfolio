# db02 SQL CRUD とスキーマ基礎
共通DB構成を使って、CRUD、制約、JOIN、制約違反を確認する教材。
## 起動
```cmd
cd .\src\apps\common
docker compose up -d db
```

## 実行順
```cmd
scripts\run-sql.cmd db02 sql\001_schema.sql
scripts\run-sql.cmd db02 sql\002_seed.sql
scripts\run-sql.cmd db02 sql\003_crud_examples.sql
scripts\run-sql.cmd db02 sql\004_join_examples.sql
```

制約エラーは失敗を観察する教材なので、1ケースずつ内容を見ながら実行する。
```cmd
scripts\run-sql.cmd db02 sql\005_constraint_errors.sql
```
