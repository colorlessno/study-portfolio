# system25 Output control comparison 学習ノート

## このテーマで学ぶこと

- max tokensとtemperatureを別々の制御軸として扱うこと
- 複数設定を直積で比較するmatrix実験
- 出力の途中切れ、再現性、costを評価する観点

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system25 --show-output
```

実行前に2種類のmax tokensと2種類のtemperatureから何行できるか予想し、`matrix_results`を確認してください。

## 観察ポイント

1. 2×2で4条件が生成されることを確認する。
2. max tokensが大きい条件でoutputが長くなることを比較する。
3. temperatureを変えてもmock outputが同じである理由を実装から確認する。

## この実装の境界

outputはpromptの反復と文字数sliceで作るmockです。実tokenizerのmax tokens、LLMのsampling、文章の完結性は再現しません。既定dataでは`cutoff`も発生しないため、途中切れを確認済みとは扱えません。

## 演習

- 4条件の比較表へ長さ、途中切れ、形式遵守、再現性の列を追加する。
- temperatureだけを変える実験とmax tokensだけを変える実験を分ける。
- 実LLMで試す場合にmodel、seed、prompt、試行回数をどう固定するか書く。

説明できるようにする問い:

- max tokensを過度に小さく・大きくしたときの問題は何か。
- temperatureの高低を品質の高低と同一視できないのはなぜか。

## 完了条件

- validatorが`PASS system25`を表示する。
- matrix条件と評価項目を説明できる。
- 文字sliceと実modelのtoken上限を区別できる。

## 関連資料

- [要件定義](../../requirements/system25_requirements.md)
- [基本設計](../../basic_design/system25_basic_design.md)
- [詳細設計](../../detailed_design/system25_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
