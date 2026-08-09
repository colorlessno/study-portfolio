# system35 Prompt A/B comparison 学習ノート

## このテーマで学ぶこと

- prompt変更を同一case・同一条件で比較する方法
- aggregate結果だけでなく悪化caseを確認すること
- 採用判断と実験結果を記録する考え方

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system35 --show-output
```

実行前にAとBの勝者を予想し、`score_diff`、`winner`、`changed_cases`を確認してください。

## 観察ポイント

1. Aはprompt長、Bはprompt長に固定bonusを加えたscoreであることを確認する。
2. case内容が採点へ使われず、そのまま返ることを確認する。
3. prompt以外のmodel・data・設定を固定する理由を考える。

## この実装の境界

LLMを実行せず、prompt文字数とBへの固定bonusだけで勝者を決めます。正確性、根拠性、形式遵守、latency、costを評価していません。この勝敗はprompt Bが優れている証拠ではありません。

## 演習

- AとBへ一つだけ変更を加える実験案を作る。
- 全体scoreは改善したが重要caseが悪化する例を考える。
- 採用、保留、rollbackの判断条件を決める。

説明できるようにする問い:

- promptを複数箇所同時に変えると原因が分からなくなるのはなぜか。
- 平均scoreだけで採用してはいけないのはなぜか。

## 完了条件

- validatorが`PASS system35`を表示する。
- control条件、変更点、評価case、採用基準を説明できる。
- 合成scoreと実prompt評価を区別できる。

## 関連資料

- [要件定義](../../requirements/system35_requirements.md)
- [基本設計](../../basic_design/system35_basic_design.md)
- [詳細設計](../../detailed_design/system35_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
