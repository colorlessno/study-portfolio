# system32 RAG evaluation set 学習ノート

## このテーマで学ぶこと

- 単発demoではなく固定評価setでRAGを比較する方法
- retrieval失敗とanswer生成失敗を分けて記録すること
- baselineと変更後を同じcaseで比較する考え方

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system32 --show-output
```

実行前にcaseごとに必要な結果を予想し、`case_results`と`regression_diff`を確認してください。

## 観察ポイント

1. 入力case数と結果数が一致することを確認する。
2. `run_label`がbaseline名として保持されることを確認する。
3. retrieval hitとanswer scoreを別項目にする理由を考える。

## この実装の境界

実RAGを実行せず、全caseへ`retrieval_hit: true`と`answer_score: 0.8`を返すmockです。検索失敗、生成失敗、baselineとの差分計算は未実装です。この出力を品質実績として扱えません。

## 演習

- 正常、検索失敗、回答失敗の3caseを設計する。
- baselineとcandidateで固定すべきmodel、prompt、文書versionを列挙する。
- aggregate scoreだけでなくfailure case一覧を残す形式を考える。

説明できるようにする問い:

- RAG全体のscoreだけでは原因を特定できないのはなぜか。
- 評価setをversion管理する必要は何か。

## 完了条件

- validatorが`PASS system32`を表示する。
- case、run、baseline、regressionの関係を説明できる。
- 固定mock値と実RAG評価を区別できる。

## 関連資料

- [要件定義](../../requirements/system32_requirements.md)
- [基本設計](../../basic_design/system32_basic_design.md)
- [詳細設計](../../detailed_design/system32_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
