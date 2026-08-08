# system26 Quantization comparison 学習ノート

## このテーマで学ぶこと

- 量子化でmemory、speed、qualityにtrade-offが生じる考え方
- model形式だけでなく実行hardwareと業務taskを揃えて比較する必要性
- local AIの採用条件を測定値で残す方法

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system26 --show-output
```

実行前にQ4、Q5、Q8のどれを選ぶか条件付きで予想し、`profile_results`を比較してください。

## 観察ポイント

1. profileごとのmemory、speed、quality indexのtrade-offを読む。
2. 3つのindexがどの計測値から作られたか実装を確認する。
3. hardware、context長、taskごとに採用基準が変わる理由を考える。

## この実装の境界

各indexは配列順から作った合成値です。量子化modelをload・推論しておらず、VRAM/RAM、tokens per second、回答品質を実測していません。Q4、Q5、Q8という名前だけから実modelの性能を断定できません。

## 演習

- 実測表に必要なmodel ID、量子化方式、file size、hardware、memory、速度を列挙する。
- 要約、情報抽出、コード生成でquality評価方法を分ける。
- 許容memoryをmust条件にし、その中でquality最大を選ぶ規則を書く。

説明できるようにする問い:

- 量子化を強くすると一般に何を得て、何を失う可能性があるか。
- 別hardwareのbenchmarkをそのまま採用判断に使えないのはなぜか。

## 完了条件

- validatorが`PASS system26`を表示する。
- memory、speed、qualityのtrade-offを説明できる。
- 合成indexと実測benchmarkを区別できる。

## 関連資料

- [要件定義](../../requirements/system26_requirements.md)
- [基本設計](../../basic_design/system26_basic_design.md)
- [詳細設計](../../detailed_design/system26_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
