# db02 基本設計
## SQL CRUD とスキーマ基礎
## 0. 関連要件

- `../requirements/db02_sql_crud_schema_requirements.md`

## 1. 設計目的
顧客、商品、注文の最小スキーマを使い、CRUD、制約、JOIN、seed data を手で確認できる教材にする。
## 2. 対象範囲

- SELECT / INSERT / UPDATE / DELETE
- table、column、data type
- primary key、foreign key、unique、NOT NULL
- INNER JOIN / LEFT JOIN
- 不正データ投入時のエラー確認
## 3. 成果物構成

```text
StudyDB/
  src/apps/db02_sql_crud_schema/
    sql/
      001_schema.sql
      002_seed.sql
      003_crud_examples.sql
      004_join_examples.sql
      005_constraint_errors.sql
  doc/learning_notes/db02_sql_crud_schema/
    README.md
    docs/
      command_log.md
      schema_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| schema SQL | customers、products、orders、order_items |
| seed SQL | 教材用の顧客、商品、注文データ |
| CRUD SQL | select、insert、update、delete |
| エラーSQL | 制約違反を起こすSQL |

## 5. 出力
| 出力 | 内容 |
|---|---|
| 実行結果 | CRUDとJOINの結果 |
| エラーログ | 制約違反時のメッセージ |
| 学習メモ | schema、key、constraint の役割説明 |

## 6. 処理方針
1. 最小スキーマを作成する
2. seed data を投入する
3. CRUD SQL を順番に実行する
4. JOINで注文と明細を結合する
5. 制約違反SQLを実行し、エラー内容を記録する

## 7. 確認観点

- CRUD SQL の意味を説明できるか
- primary key、foreign key、unique、NOT NULL の違いを説明できるか
- JOINで複数テーブルの関係を追えるか

## 8. 後続工程への引き継ぎ

詳細設計では、SQLファイル、実行順序、期待結果、失敗ケースを定義する。
