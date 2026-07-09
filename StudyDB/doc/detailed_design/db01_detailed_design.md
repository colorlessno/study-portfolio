# db01 詳細設計
## DB基礎と種類分類

## 0. 関連文書

- `../requirements/db01_db_foundations_requirements.md`
- `../basic_design/db01_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/db01_db_foundations/
  README.md
  docs/
    storage_comparison.md
    db_category_matrix.md
    use_case_mapping.md
    db01_completion_check.md
```

## 2. ファイル設計

| ファイル | 内容 |
|---|---|
| `README.md` | 学習目的、読む順番、後続db02-db07への接続 |
| `storage_comparison.md` | file、Excel、object storage、DBの比較 |
| `db_category_matrix.md` | RDB、Document、Key-Value、Search、DWH、Vector DBの分類表 |
| `use_case_mapping.md` | 業務更新、検索、分析、キャッシュ、RAGの選定例 |
| `db01_completion_check.md` | 受入条件に対応した確認チェック |

## 3. 比較表設計

| 列 | 内容 |
|---|---|
| category | 保存手段またはDB分類 |
| data model | table、document、key-value、index、columnar、embedding |
| write pattern | 更新頻度、同時更新、追記中心など |
| read pattern | 主キー検索、条件検索、全文検索、集計、類似検索 |
| strength | 得意領域 |
| weakness | 不得意領域 |
| related lesson | db02-db07の関連テーマ |

## 4. 題材データ設計

| 題材 | 用途 |
|---|---|
| customer | 業務マスタ、RDB / Document 比較 |
| order | OLTP、正規化、トランザクション説明 |
| product_search_text | Search DB、全文検索説明 |
| sales_event | DWH、OLAP説明 |
| support_article_embedding | Vector DB、RAG説明 |

## 5. 確認手順

1. `storage_comparison.md` でDBとファイル/Excelの違いを確認する
2. `db_category_matrix.md` でDB分類ごとの保存モデルを確認する
3. `use_case_mapping.md` で用途別の選定理由を書く
4. db02-db07のどこで深掘りするかを対応づける

## 6. 完了条件

- DBとファイル/Excelの違いを説明できる
- RDB、NoSQL、cache、search、DWH、vector DBの用途差を説明できる
- 後続db02-db07との関係を説明できる

## 7. 安全性

- 実サービス接続や課金が発生するDBは使わない
- 題材データは架空データに限定する
- テキストファイルは UTF-8 BOMなしで保存する

