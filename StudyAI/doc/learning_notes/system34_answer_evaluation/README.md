# system34 Answer evaluation 学習ノート

## このテーマで学ぶこと

- 回答を正確性、根拠性など複数観点で評価する方法
- retrieval品質とanswer品質を分離すること
- 自動評価と人手reviewを組み合わせる考え方

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system34 --show-output
```

実行前に正確性と根拠性を採点し、`score_breakdown`と`risk_flags`を確認してください。

## 観察ポイント

1. expected answerが生成文へ含まれるとcorrectnessが1.0になることを確認する。
2. evidenceにexpected answerが含まれるとgroundednessが1.0になる実装を確認する。
3. 網羅性、不要情報、矛盾を現在の出力で評価できるか考える。

## この実装の境界

substring一致だけの決定的評価です。意味的な正しさ、引用箇所との整合、網羅性、不要情報、有害性は判定しません。evidenceに正解文字列があるだけでもgrounded扱いになるため、実際に回答が根拠を使った証明ではありません。

## 演習

- 正解文字列を含むが意味が逆になる回答を作る。
- 正しいが表現の異なる回答を作り、substring評価の弱点を示す。
- 自動評価後に人手確認すべきrisk条件を決める。

説明できるようにする問い:

- correctnessとgroundednessを分ける理由は何か。
- LLM-as-a-judgeだけに依存する評価にはどんなriskがあるか。

## 完了条件

- validatorが`PASS system34`を表示する。
- 評価観点と採点根拠を説明できる。
- 文字列一致と意味評価を区別できる。

## 関連資料

- [要件定義](../../requirements/system34_requirements.md)
- [基本設計](../../basic_design/system34_basic_design.md)
- [詳細設計](../../detailed_design/system34_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
