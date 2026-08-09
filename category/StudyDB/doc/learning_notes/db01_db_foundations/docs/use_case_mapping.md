# ユースケース対応

| 用途 | 選びやすい保存先 | 理由 |
|---|---|---|
| 注文登録 | RDB | 顧客、注文、在庫の整合性が必要 |
| セッションcache | Key-Value | key lookupとTTLが重要 |
| 商品全文検索 | Search DB | 単語、表記揺れ、ランキングが必要 |
| 月次売上分析 | DWH | 大量集計と履歴分析が中心 |
| FAQ RAG | Vector DB + RDB/Search | 類似検索と根拠管理を分ける |

