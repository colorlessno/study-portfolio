# system21 Temperature comparison 学習ノート

## このテーマで学ぶこと

- temperatureを変えて出力の揺らぎを比較する実験設計
- 同じ条件で複数回試す必要性
- 再現性が必要な業務処理と、発想の幅が必要な処理の違い

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system21 --show-output
```

実行前に0.1と0.7で期待する違いを言語化し、実行後に`runs`と`recommendation`を確認してください。

## 観察ポイント

1. 2つのtemperatureを各3回、合計6回比較していることを確認する。
2. temperature以外の条件を固定する理由を考える。
3. outputだけでなく、正確性、再現性、形式遵守をどう採点するか考える。

## この実装の境界

出力はtemperatureとtrial番号から決定的に作るmockです。実LLMの確率分布からsampleした文章ではなく、temperatureが品質や創造性を必ず向上させることも示しません。実験ではmodel、prompt、seedなどの条件を記録して複数回評価します。

## 演習

- temperatureを0.0、0.5、1.0へ変え、比較表の項目を設計する。
- 問い合わせ返信とアイデア出しで、推奨設定が異なる理由を書く。
- 文章の違いを目視だけでなくscore化する評価基準を3つ考える。

説明できるようにする問い:

- temperatureを比較するとき、なぜ1回の出力だけでは不十分か。
- 業務利用で出力の多様性より再現性を優先する場面はどこか。

## 完了条件

- validatorが`PASS system21`を表示する。
- 独立変数、固定条件、試行回数、評価指標を説明できる。
- mockの差を実LLMのsampling結果だと誤認しない。

## 関連資料

- [要件定義](../../requirements/system21_requirements.md)
- [基本設計](../../basic_design/system21_basic_design.md)
- [詳細設計](../../detailed_design/system21_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
