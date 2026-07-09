# db01 要件定義
## DB基礎と種類分類

## 1. 目的

DBとは何か、なぜファイルやExcelだけでは不足するのか、RDB / NoSQL / cache / search / DWH / vector DB などの分類を理解し、用途に応じたDB選定の入口を作る。

## 2. 学習対象

- DBの役割
- RDBとNoSQLの違い
- Key-Value、Document、Graph、Column、Time-series、Search、DWH、Vector DB
- OLTP と OLAP の違い
- アプリ、業務、分析、AI検索で求める性質の違い

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | DB、ファイル、Excel、オブジェクトストレージの違いを比較する |
| FR-02 | RDB、NoSQL、cache、search、DWH、vector DB の用途表を作る |
| FR-03 | 顧客・注文・商品など同じ題材を複数DB分類へ当てはめて比較する |
| FR-04 | 業務システム、ログ、検索、分析、RAG のどれに向くかを整理する |
| FR-05 | 後続 db02〜db07 との対応を示す |

## 4. 非機能要件

- 製品名の暗記ではなく、保存モデルと用途の違いを中心にする。
- 実サービス接続や課金が発生するDBは使わない。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- 本番DB構築
- クラウドDBの詳細設定
- 分散DBの内部実装深掘り

## 6. 成果物

```text
StudyDB/
  doc/requirements/db01_db_foundations_requirements.md
  doc/basic_design/db01_basic_design.md
  doc/detailed_design/db01_detailed_design.md
  doc/learning_notes/db01_db_foundations/
```

## 7. 受入条件

- DB分類ごとの用途と不得意領域を説明できる。
- 業務アプリ、検索、分析、AI検索で選ぶDBが変わる理由を説明できる。
- 後続のSQL、正規化、トランザクション、性能、バックアップ学習につなげられる。
