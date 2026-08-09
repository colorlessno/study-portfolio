# db04 詳細設計
## トランザクション・ロック・分離レベル

## 0. 関連文書

- `../requirements/db04_transaction_lock_isolation_requirements.md`
- `../basic_design/db04_basic_design.md`

## 1. 製造対象

```text
src/apps/db04_transaction_lock_isolation/
  README.md
  sql/
    001_schema.sql
    002_seed.sql
    003_commit_rollback.sql
    004_concurrent_update_session_a.sql
    005_concurrent_update_session_b.sql
    006_isolation_observation.sql
doc/learning_notes/db04_transaction_lock_isolation/
  README.md
  docs/
    transaction_log.md
    concurrent_update_log.md
    isolation_matrix.md
```

## 2. DB実行環境
| 項目 | 内容 |
|---|---|
| DB | PostgreSQL 16 alpine |
| database | `studydb` |
| 実行方式 | 2つのpsqlセッションを使う |
| 起動方式 | `category/StudyDB/src/apps/common` の共通DB構成を使う |
| 前提 | 教材DBのみを操作する |

## 3. テーブル設計
| table | column | 目的 |
|---|---|---|
| `products` | `id`, `name`, `stock`, `updated_at` | 在庫減算と同時更新の観察 |
| `orders` | `id`, `product_id`, `quantity`, `status`, `created_at` | 注文処理 |
| `transaction_events` | `id`, `event_name`, `note`, `created_at` | rollback確認用の記録 |

## 4. SQLファイル設計
| ファイル | 内容 |
|---|---|
| `001_schema.sql` | products、orders、transaction_eventsを作成 |
| `002_seed.sql` | 在庫数を持つ商品を投入 |
| `003_commit_rollback.sql` | 正常commitと途中失敗rollbackを確認 |
| `004_concurrent_update_session_a.sql` | session Aで在庫行を更新し、60秒のアイドル制限内でcommitまたはrollbackを待つ |
| `005_concurrent_update_session_b.sql` | session Bで同じ行を更新し、5秒のlock timeoutを観察 |
| `006_isolation_observation.sql` | 分離レベルごとの観察メモ用SQL |

## 5. 同時実行手順
| step | session A | session B |
|---|---|---|
| 1 | `BEGIN;` | 待機 |
| 2 | 対象商品の在庫を更新 | 待機 |
| 3 | commitせず状態を保持 | `BEGIN;` |
| 4 | 待機 | 同じ商品を更新し、5秒でlock timeoutになることを観察 |
| 5 | `COMMIT;` または `ROLLBACK;` | 更新結果を確認 |

## 6. 分離レベル表設計
| isolation level | dirty read | non-repeatable read | phantom read | 観察方針 |
|---|---|---|---|---|
| READ COMMITTED | 防止 | 起こり得る | 起こり得る | 同じSELECTの結果変化を見る |
| REPEATABLE READ | 防止 | 防止 | PostgreSQLでは防止相当 | トランザクション内の読み取り固定を確認 |
| SERIALIZABLE | 防止 | 防止 | 防止 | 競合時の再試行必要性を確認 |

## 7. 確認手順
1. schemaとseedを投入する
2. `003_commit_rollback.sql` でcommit/rollback前後の状態を記録する
3. 2つのpsqlセッションを開く
4. session A/BのSQLを順番に実行してlock waitを記録する
5. 分離レベル表に観察結果を追記する

## 8. 完了条件

- commitとrollbackの違いをデータ状態で説明できる
- lock waitまたは競合を再現できる
- 業務処理とトランザクション境界を決める理由を説明できる

## 9. 安全性

- 教材DB以外では実行しない
- 破壊操作はseed済み教材データに限定する
- 2セッション手順は詳細に記録し、session Aを必ずcommitまたはrollbackして途中状態を放置しない
