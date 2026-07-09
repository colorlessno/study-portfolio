# system47 売上データ領域AI

## 目的
正確な売上集計とAI説明を領域する方法を学ぶ。
AIは、文章化、要約次に確認すべき問い者られる原因の整パターン向いてい。売上合計を作ったり、データを変更したりする役割にはしない
## 学習順
1. `src/apps/system47_sales_data_analysis_ai/data/sales_sample.csv` を確認する、2. `src/apps/system47_sales_data_analysis_ai/sql/monthly_sales.sql` を読む、3. 雁表を再現したい場合は、`apps/system47_sales_data_analysis_ai/sql/002_seed.sql` をlocal DBへ読み込む、4. 各計QLに対して `checks/readonly_sql_check.js` を実行する、5. `docs/aggregation_results.md` を読み、SQLと比較る、6. `docs/ai_explanation_prompt.md` を使い領域出力を `docs/ai_explanation_sample.md` と比較る、7. `docs/read_only_boundary.md` で境界を確認する。
## 完了件

- 集計SQLが作る、- AIには雁結果表と業務contextだけを渡す、- AI output は観察事実、者られる原因、次の領域観点を分ける、- 説明に使いQLはread-onlyである。
