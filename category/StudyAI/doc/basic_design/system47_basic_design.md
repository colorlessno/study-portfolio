# system47 基本設計

## Sales data analysis AI / BI explanation

## 0. 関連要件

- `../requirements/system47_sales_data_analysis_ai_requirements.md`

## 1. 設計目的

売上データの正確な集計をSQL/BI側で行い、AIは傾向説明・異常値の仮説・次の分析観点の提示に限定する教材にする。

## 2. 対象領域

- sales dataset
- SQL aggregation
- BI chart / dashboard 相当の集計表
- anomaly explanation
- trend summary
- hypothesis generation
- read-only SQL tool boundary

## 3. 成果物構造

```text
category/StudyAI/
  src/apps/system47_sales_data_analysis_ai/
    data/
      sales_sample.csv
    sql/
      monthly_sales.sql
      product_sales.sql
      customer_sales.sql
  doc/learning_notes/system47_sales_data_analysis_ai/
    README.md
    docs/
      aggregation_results.md
      ai_explanation_prompt.md
      read_only_boundary.md
```

## 4. 入力

| 入力 | 内容 |
|---|---|
| 売上サンプル | 日付、商品、顧客、数量、金額 |
| 集計SQL | 月別、商品別、顧客別の集計式 |
| 集計結果 | AIに渡す表またはグラフ相当のデータ |
| 禁止操作 | update、delete、insertなどの更新SQL |

## 5. 出力

| 出力 | 内容 |
|---|---|
| 集計表 | SQLで算出した正確な数値 |
| AI説明メモ | 傾向、異常値、仮説、追加確認観点 |
| read-only基準表 | AIが見てよいデータと実行してはいけない操作 |

## 6. 処理方針

1. 教材用の売上サンプルを用意する
2. SQLで集計結果を作る
3. 集計結果だけをAI説明の入力にする
4. AIは数値を再計算せず、説明と仮説に限定する
5. read-only基準と禁止SQLを明記する

## 7. 確認観点

- 集計とAI説明の役割分担を説明できるか
- AIが直接更新SQLを実行しない理由を説明できるか
- 傾向、異常値、次の分析観点を分けて文章化できるか

## 8. 後続工程への引き継ぎ

詳細設計では、サンプルデータ列、SQL・集計結果例、AI説明プロンプト、禁止操作チェックを定義する。
