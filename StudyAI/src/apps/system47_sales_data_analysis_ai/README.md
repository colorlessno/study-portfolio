# system47 売上データ分析AI

## 目的

SQLで正確な数値を作り、AIは計算済みの結果を説明する、という役割分担を学ぶ。

## 対象範囲

- 小さな売上データを読み込む。
- 月別、商品別、顧客セグメント別の売上をSQLで集計する。
- 説明用SQLがread-onlyであることを確認する。
- AIは文章化、傾向説明、仮説、次の分析観点の提示に限定する。

## ファイル

| path | 目的 |
| --- | --- |
| `data/sales_sample.csv` | 小さなサンプルデータ |
| `sql/001_schema.sql` | table定義 |
| `sql/002_seed.sql` | `data/sales_sample.csv` と同じ内容のseed |
| `sql/monthly_sales.sql` | 月別集計 |
| `sql/product_sales.sql` | 商品別集計 |
| `sql/customer_sales.sql` | 顧客セグメント別集計 |
| `checks/readonly_sql_check.js` | read-only SQL の簡易確認 |

## 実行例

```cmd
node checks\readonly_sql_check.js sql\monthly_sales.sql
node checks\readonly_sql_check.js sql\product_sales.sql
node checks\readonly_sql_check.js sql\customer_sales.sql
```

SQLは、`data/sales_sample.csv` または `sql/002_seed.sql` をDBへ読み込んでから実行する。この教材では、AIがDBへ直接接続する必要はない。
