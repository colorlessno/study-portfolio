# db07 NoSQL・cache・search・DWH比較

同じ顧客・注文モデルをRDB、key-value、document、cache、search、DWH、vector DBで表し、問い合わせと整合性要件から使い分けます。

## 到達目標

- 各データストアが得意な問い合わせと更新を説明できる。
- 正本、検索用の派生データ、cacheを区別できる。
- vector DBとRAGの役割を、原文や業務DBとの関係から説明できる。

## 教材

1. [データストア比較](docs/datastore_comparison.md)
2. [顧客・注文モデルの表現差](docs/customer_order_model_variants.md)
3. [cache・search・DWH](docs/cache_search_dwh_notes.md)
4. [vector DB・RAG](docs/vector_db_rag_notes.md)
5. [完了チェック](docs/db07_completion_check.md)

具体例は [samples](samples/) にあります。[要件定義](../../requirements/db07_nosql_cache_search_dwh_requirements.md)、[基本設計](../../basic_design/db07_basic_design.md)、[詳細設計](../../detailed_design/db07_detailed_design.md) も参照します。

## 始める前の問い

- 注文の正本をcacheだけに置くと何が起きるか。
- 商品検索と売上集計は同じ保存先が最適か。
- embeddingから元文書を完全に復元できるか。

## 15分で再開

1. 「顧客の最新注文を表示」「商品説明を全文検索」「月次売上を集計」の3つを選ぶ。
2. データストア比較から候補を割り当てる。
3. 正本か派生データか、同期が遅れた場合に困るかを1行ずつ書く。

## 手を動かす課題

samplesのRDB、key-value、document表現を比較し、次の変更を各形式へ反映します。

- 注文に配送状況を追加する。
- 顧客名を変更する。
- 商品説明から類似商品を探す。

重複データ、更新箇所、問い合わせやすさの違いを記録します。実際の外部NoSQLサービスは起動しません。

## 完了条件

1つの用途に複数候補があることを認めた上で、問い合わせ、整合性、更新頻度、復旧元を根拠に選定できれば完了です。
