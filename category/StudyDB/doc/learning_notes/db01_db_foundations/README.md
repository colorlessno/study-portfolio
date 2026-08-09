# db01 DB基礎と種類分類

DB、ファイル、Excel、object storage、RDB、NoSQL、cache、search、DWH、vector DBを「何を保存するか」ではなく「どんな問いに答えるか」から整理します。

## 到達目標

- 永続性、検索、同時更新、整合性の違いを説明できる。
- 顧客・注文・商品という同じ題材に対し、保存先を理由付きで選べる。
- cacheやsearchを正本のDBと混同しない。

## 教材

1. [保存方式の比較](docs/storage_comparison.md)
2. [DB分類表](docs/db_category_matrix.md)
3. [用途との対応](docs/use_case_mapping.md)
4. [完了チェック](docs/db01_completion_check.md)

設計上の前提は [要件定義](../../requirements/db01_db_foundations_requirements.md)、[基本設計](../../basic_design/db01_basic_design.md)、[詳細設計](../../detailed_design/db01_detailed_design.md) で確認できます。

## 始める前の問い

- ExcelとRDBの境目はどこにあるか。
- object storage、DWH、searchはどの問いに強いか。
- 速度を上げたいだけでcacheを正本にしてよいか。

## 15分で再開

1. 保存方式の比較から3種類だけ選ぶ。
2. 「注文履歴を正確に残す」「商品画像を保存する」「商品名を全文検索する」を割り当てる。
3. 選定理由を整合性・検索方法・更新頻度の3点で1行ずつ書く。

## 手を動かす課題

用途との対応表に、自分が扱ったことのあるシステムを1つ追加します。正本、派生データ、一時データを分け、障害時にどこから復元するかも書きます。

## 完了条件

完了チェックに答え、少なくとも1つの不適切な選択例と、その理由を説明できれば完了です。このテーマではDockerや外部サービスは使いません。
