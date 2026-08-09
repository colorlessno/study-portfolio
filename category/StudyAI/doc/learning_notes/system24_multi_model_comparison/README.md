# system24 Multi model comparison 学習ノート

## このテーマで学ぶこと

- model選定を品質、latency、costなど複数軸で比較する方法
- 評価条件を固定し、model以外の差を減らす実験設計
- 総合点だけでなく業務制約から採用基準を決める考え方

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system24 --show-output
```

実行前にどのmodelを採用するか予想し、実行後に`model_results`と`selected_model`が同じ判断基準になっているか確認してください。

## 観察ポイント

1. modelごとにquality、latency、cost indexが変わることを確認する。
2. quality最大のmodelではなく先頭modelが選択される実装を特定する。
3. must条件と比較評価を分けた選定表を考える。

## この実装の境界

表示値は配列順から合成したmock値です。modelを実行しておらず、回答品質、実測latency、token cost、hardware制約を評価していません。`selected_model`も最適化結果ではなく先頭要素です。

## 演習

- 正確性優先、応答速度優先、cost優先の3業務で採用modelを選ぶ。
- qualityの採点基準を、正解性・根拠性・形式遵守へ分解する。
- model名や配列順を変えても妥当な選定になる実装案を書く。

説明できるようにする問い:

- 同一promptの回答を目視比較するだけでは不十分なのはなぜか。
- model選定結果と、その判断根拠を再現するため何を保存するか。

## 完了条件

- validatorが`PASS system24`を表示する。
- quality、latency、cost、運用制約を分けて説明できる。
- mock indexを実modelのbenchmarkと誤認しない。

## 関連資料

- [要件定義](../../requirements/system24_requirements.md)
- [基本設計](../../basic_design/system24_basic_design.md)
- [詳細設計](../../detailed_design/system24_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
