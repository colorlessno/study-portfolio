# db01 基本設計
## DB基礎と種類分類

## 0. 関連要件

- `../requirements/db01_db_foundations_requirements.md`

## 1. 設計目的

DB、ファイル、Excel、オブジェクトストレージ、RDB、NoSQL、cache、search、DWH、vector DB の違いを、用途と保存モデルから比較できる教材にする。

## 2. 対象範囲

- DBの役割
- DB以外の保存手段との違い
- RDB / NoSQL / cache / search / DWH / vector DB の分類
- OLTP / OLAP の違い
- 後続 db02-db07 への接続

## 3. 成果物構成

```text
category/StudyDB/
  doc/learning_notes/db01_db_foundations/
    README.md
    docs/
      storage_comparison.md
      db_category_matrix.md
      use_case_mapping.md
```

## 4. 入力

| 入力 | 内容 |
|---|---|
| 題材データ | 顧客、商品、注文、ログ、検索文書、分析レコード |
| 比較対象 | file、Excel、object storage、RDB、Document、Key-Value、Search、DWH、Vector DB |
| 用途 | 業務更新、検索、分析、キャッシュ、RAG |

## 5. 出力

| 出力 | 内容 |
|---|---|
| 保存手段比較表 | 保存モデル、得意領域、不得意領域 |
| DB分類表 | 分類ごとの用途、代表的なデータ形、後続学習との対応 |
| ユースケース対応表 | 業務、ログ、検索、分析、AI検索に対する選定理由 |

## 6. 処理方針

1. 同じ題材を複数の保存手段へ当てはめる
2. 保存モデル、更新特性、検索特性を比較する
3. OLTP と OLAP の違いを整理する
4. 後続 db02-db07 のどこで深掘りするかを対応づける

## 7. 確認観点

- DBとファイル/Excelの違いを説明できるか
- RDB、NoSQL、cache、search、DWH、vector DB の用途差を説明できるか
- 業務アプリ、分析、AI検索で選定理由が変わることを説明できるか

## 8. 後続工程への引き継ぎ

詳細設計では、比較表の項目、題材データ、記入例、後続テーマへのリンクを定義する。

