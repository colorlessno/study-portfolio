# system27 VLM image size accuracy 学習ノート

## このテーマで学ぶこと

- 画像size、解像度、圧縮がVLM入力へ影響する可能性
- 同じ画像と同じ質問で入力条件だけを変える比較方法
- 読み取り精度と処理時間・costのtrade-off

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system27 --show-output
```

smallとlargeのどちらが高い値になるか予想し、`variant_results`の`estimated_accuracy`を確認してください。

## 観察ポイント

1. width 320と1280からどのように値が計算されるか確認する。
2. `expected_points`は採点に使われず、そのまま出力されることを確認する。
3. width以外にheight、圧縮、文字size、cropが必要な理由を考える。

## この実装の境界

画像fileもVLMも使用せず、widthを1280で割った合成値をaccuracyと呼んでいます。正解点の照合、OCR、latency、token costは未実装であり、large画像ほど必ず正確だとは証明しません。

## 演習

- 同一画像からsmall、medium、largeの評価caseを設計する。
- 読み取るべき項目をground truthとして先に定義する。
- accuracyだけでなくlatency、cost、file sizeを含む採用表を作る。

説明できるようにする問い:

- 画像size以外の条件を固定する必要があるのはなぜか。
- 解像度を上げ続けることが最適解とは限らないのはなぜか。

## 完了条件

- validatorが`PASS system27`を表示する。
- 入力条件、ground truth、評価指標を説明できる。
- estimated accuracyと実VLM精度を区別できる。

## 関連資料

- [要件定義](../../requirements/system27_requirements.md)
- [基本設計](../../basic_design/system27_basic_design.md)
- [詳細設計](../../detailed_design/system27_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
