# system47 詳細設計
## Sales data analysis AI / BI explanation

## 0. 関連文書

- `../requirements/system47_sales_data_analysis_ai_requirements.md`
- `../basic_design/system47_basic_design.md`

## 1. 製造対象

```text
apps/system47_sales_data_analysis_ai/
  README.md
  data/
    sales_sample.csv
  sql/
    001_schema.sql
    002_seed_from_csv_note.md
    monthly_sales.sql
    product_sales.sql
    customer_sales.sql
  checks/
    readonly_sql_check.js
doc/learning_notes/system47_sales_data_analysis_ai/
  README.md
  docs/
    aggregation_results.md
    ai_explanation_prompt.md
    ai_explanation_sample.md
    read_only_boundary.md
```

## 2. sales dataset 設計

| column | 内容 |
|---|---|
| `order_date` | 注文日 |
| `customer_segment` | 個人、法人などの架空区分 |
| `product_category` | 商品カテゴリ |
| `product_name` | 架空商品名 |
| `quantity` | 数量 |
| `unit_price` | 単価 |
| `region` | 架空地域 |

実顧客名、実住所、実売上データは含めない。

## 3. SQL集計設計

| SQL | 内容 |
|---|---|
| `monthly_sales.sql` | 月別売上、注文数、平均単価 |
| `product_sales.sql` | 商品カテゴリ別売上、数量 |
| `customer_sales.sql` | 顧客区分別売上、地域別傾向 |

集計値はSQLで算出する。AI説明入力には、SQLの結果表だけを渡す。

## 4. read-only境界設計

| 操作 | 扱い |
|---|---|
| SELECT | 許可 |
| WITH / CTE | 許可 |
| INSERT | 禁止 |
| UPDATE | 禁止 |
| DELETE | 禁止 |
| DROP / ALTER / CREATE | 禁止 |
| 外部送信 | 禁止 |

`readonly_sql_check.js` はSQL文字列に更新系・DDL系キーワードが含まれないことを確認する。完全なSQL parserではなく、教材用の境界確認として使う。

## 5. AI説明プロンプト設計

| 入力 | 内容 |
|---|---|
| aggregation table | SQLで算出した結果 |
| business question | 何を説明したいか |
| constraints | 数値を再計算しない、根拠行を引用する、仮説と事実を分ける |

| 出力 | 内容 |
|---|---|
| trend summary | 傾向 |
| anomaly note | 異常値または目立つ変化 |
| hypothesis | 原因仮説 |
| next analysis | 次に確認するSQLや切り口 |
| limitation | この集計だけでは断定できないこと |

## 6. 確認手順

1. `sales_sample.csv` の列と架空データを確認する
2. 集計SQLを実行し、結果を `aggregation_results.md` に貼る
3. SQL結果表をAI説明入力に変換する
4. AI説明サンプルで事実、仮説、次の分析観点を分ける
5. `readonly_sql_check.js` で禁止SQLを検査する

## 7. 完了条件

- 集計とAI説明の役割分担を説明できる
- AIに数値を再計算させない境界を説明できる
- read-only SQL境界を検査できる
- 傾向、異常値、仮説、次の分析観点を分けて記録できる

## 8. 安全性

- 実売上データや個人情報を使わない
- AIに更新SQLやDDLを実行させない
- 集計値の正確性はSQL側で担保し、AI説明は補助に限定する

