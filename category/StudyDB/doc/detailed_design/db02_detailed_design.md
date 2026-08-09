# db02 詳細設計
## SQL CRUD とスキーマ基礎
## 0. 関連文書

- `../requirements/db02_sql_crud_schema_requirements.md`
- `../basic_design/db02_basic_design.md`

## 1. 製造対象

```text
src/apps/db02_sql_crud_schema/
  README.md
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
    constraint_error_notes.md
```

## 2. DB実行環境
| 項目 | 内容 |
|---|---|
| DB | PostgreSQL 16 alpine |
| database | `studydb` |
| user | `postgres` |
| password | 教材用固定値。実秘密情報は使わない |
| 起動方式 | `category/StudyDB/src/apps/common` の共通DB構成を使う |
| SQL実行 | `category/StudyDB\src\apps\common\scripts\run-sql.cmd db02 sql\001_schema.sql` |

## 3. テーブル設計
| table | column | 制約 |
|---|---|---|
| `customers` | `id`, `name`, `email`, `created_at` | primary key、email unique、name not null |
| `products` | `id`, `name`, `price`, `created_at` | primary key、price >= 0 |
| `orders` | `id`, `customer_id`, `ordered_at`, `status` | primary key、customer foreign key |
| `order_items` | `id`, `order_id`, `product_id`, `quantity`, `unit_price` | order/product foreign key、quantity > 0 |

## 4. SQLファイル設計
| ファイル | 内容 |
|---|---|
| `001_schema.sql` | table作成、primary key、foreign key、unique、not null、check制約 |
| `002_seed.sql` | 顧客3件、商品3件、注文3件、注文明細複数件 |
| `003_crud_examples.sql` | SELECT、INSERT、UPDATE、DELETEの成功例 |
| `004_join_examples.sql` | INNER JOIN、LEFT JOINの最小例 |
| `005_constraint_errors.sql` | unique違反、foreign key違反、not null違反、check違反 |

## 5. 確認手順
1. PostgreSQLコンテナを起動する
2. `001_schema.sql` を実行する
3. `002_seed.sql` を実行する
4. `003_crud_examples.sql` の結果を `command_log.md` に記録する
5. `004_join_examples.sql` でテーブル結合を確認する
6. `005_constraint_errors.sql` を1ケースずつ実行し、エラー内容を記録する

## 6. 完了条件

- CRUD SQLを実行できる
- primary key、foreign key、unique、not null、check制約を説明できる
- JOINで注文、明細、顧客、商品を追跡できる
- 制約違反のエラーを説明できる

## 7. 安全性

- DB接続値は教材用固定値に限定する
- SQLは教材DBだけに実行する
- 実個人情報や実顧客情報をseedに含めない
