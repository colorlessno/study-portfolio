# system33 Retrieval evaluation 学習ノート

## このテーマで学ぶこと

- 回答生成前にretrievalだけを評価する理由
- hit、recall at k、failure caseの読み方
- top-kを増やす効果とnoise・costのtrade-off

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system33 --show-output
```

実行前に期待根拠が検索結果へ含まれるか確認し、`hit_rate`と`recall_at_k`を計算してください。

## 観察ポイント

1. 期待根拠と検索結果の共通部分を確認する。
2. kが検索結果件数として出力されることを確認する。
3. 期待根拠が複数の場合にrecallがどう変わるか考える。

## この実装の境界

既に与えられたdocument ID集合を比較するだけで、query、検索処理、順位、scoreは扱いません。`hit_rate`も1caseで一つでも当たれば1.0になる簡易値です。複数queryの平均hit rateではありません。

## 演習

- 期待根拠を2件にし、検索結果を変えてrecallを手計算する。
- 正解が1位と最下位にあるcaseを分ける評価指標を調べる。
- kを増やしたときのrecall、noise、LLM入力長を比較する。

説明できるようにする問い:

- 回答が誤っているとき、retrieval評価を先に見る理由は何か。
- hitとrecallが高くても検索品質が十分とは限らないのはなぜか。

## 完了条件

- validatorが`PASS system33`を表示する。
- expected evidence、result、k、recallの関係を説明できる。
- 簡易1case値とdataset全体の指標を区別できる。

## 関連資料

- [要件定義](../../requirements/system33_requirements.md)
- [基本設計](../../basic_design/system33_basic_design.md)
- [詳細設計](../../detailed_design/system33_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
