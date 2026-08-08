# system31 Ground truth creation 学習ノート

## このテーマで学ぶこと

- AI評価の前に質問、正解、根拠を固定する理由
- 正解dataを作る人とreviewする人を分ける考え方
- 正解が一つに定まらないcaseの扱い

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system31 --show-output
```

実行前に評価caseへ必要な項目を挙げ、`case`、`case_id`、`review_status`を確認してください。

## 観察ポイント

1. 入力した質問、正解、根拠がcaseへ保持されることを確認する。
2. 同じ入力から同じcase IDが作られることを確認する。
3. review statusが`draft`のままである意味を考える。

## この実装の境界

入力をcase形状へ包むだけのmockです。datasetへの永続化、schema validation、review履歴、承認、version管理は行いません。caseが作られたことと、正解として妥当であることは別です。

## 演習

- 明確な正解、複数の許容表現、正解不能の3caseを作る。
- 根拠箇所と採点観点を分離したschemaを考える。
- 作成者以外がreviewするchecklistを作る。

説明できるようにする問い:

- 評価実行後に正解dataを変えると比較が壊れるのはなぜか。
- ground truthにも誤りや偏りが入り得るのはなぜか。

## 完了条件

- validatorが`PASS system31`を表示する。
- 質問、正解、根拠、reviewの役割を説明できる。
- draft caseと承認済み評価dataを区別できる。

## 関連資料

- [要件定義](../../requirements/system31_requirements.md)
- [基本設計](../../basic_design/system31_basic_design.md)
- [詳細設計](../../detailed_design/system31_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
