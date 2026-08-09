# DB分類表

| 分類 | data model | read pattern | write pattern | 後続 |
|---|---|---|---|---|
| RDB | table / relation | SQL、JOIN、条件検索 | transaction更新 | db02-db06 |
| Document | JSON document | document単位取得 | 集約単位更新 | db07 |
| Key-Value | key -> value | key lookup | TTL、一時保存 | db07 |
| Search | inverted index | 全文検索、filter | index更新 | db07 |
| DWH | columnar table | 大量集計 | 追記中心 | db07 |
| Vector DB | embedding | 類似検索 | 再embedding、再index | db07 |

