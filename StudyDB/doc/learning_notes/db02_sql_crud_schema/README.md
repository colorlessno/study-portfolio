# db02 SQL CRUDとスキーマ基礎

共通PostgreSQL環境を使い、CRUD、JOIN、主キー・外部キー・一意制約を結果とエラーから学びます。

## 到達目標

- テーブル定義から許可されるデータと拒否されるデータを予想できる。
- CRUDとJOINの結果行数を説明できる。
- 制約エラーを「失敗」ではなく、守られたルールの証拠として読める。

## 教材

- [SQL教材](../../../src/apps/db02_sql_crud_schema/README.md)
- [コマンド記録](docs/command_log.md)
- [スキーマの観察](docs/schema_notes.md)
- [制約エラーの観察](docs/constraint_error_notes.md)
- [要件定義](../../requirements/db02_sql_crud_schema_requirements.md) / [基本設計](../../basic_design/db02_basic_design.md) / [詳細設計](../../detailed_design/db02_detailed_design.md)

## 始める前の問い

- customers、items、orders、order_itemsの関係は何対何か。
- 同じemailを2件登録すると、どの制約が止めるか。
- INNER JOINで関連行のないデータはどうなるか。

## 15分で再開

Docker Desktopを起動し、リポジトリルートで実行します。

```cmd
node StudyDB\scripts\validate-studydb.mjs db02
```

成功したら、出力で確認された件数と「重複emailが拒否された理由」を自分の言葉で1行ずつ記録します。

## SQLを順番に観察する

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml up -d --wait --wait-timeout 30 db
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\001_schema.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\002_seed.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\003_crud_examples.sql
StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\004_join_examples.sql
```

各SQLは結果を見る前に行数を予想します。`005_constraint_errors.sql` は意図的にエラーを起こすため、内容を読み1ケースずつ手動で試します。

## 後片付けと完了条件

```cmd
docker compose -f StudyDB\src\apps\common\docker-compose.yml down
```

CRUD、JOIN、制約違反について「予想・実測・理由」が記録できれば完了です。接続先はローカル教材DBに限定します。
