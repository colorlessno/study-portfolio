# system30 Duplicate document detection 学習ノート

## このテーマで学ぶこと

- 重複・版違い文書が検索結果を偏らせる理由
- 類似度thresholdとfalse positive・false negativeの関係
- 検出結果と採用・除外判断を分けるdata品質管理

## 15分で再開する

```powershell
python StudyAI\scripts\validate-ai-learning.py system30 --show-output
```

実行前にdoc-1とdoc-2だけが近いか予想し、実行後に`duplicate_groups`を確認してください。

## 観察ポイント

1. 既定dataでは3文書すべてが互いに候補になることを確認する。
2. 共通する日本語文字が多いとscoreが上がる実装を確認する。
3. 期待より広く検出された結果をfalse positiveとして分析する。

## この実装の境界

正規表現で分けた文字集合の重なりだけを類似度に使います。完全一致hash、意味embedding、版番号、更新日時は使わず、候補を自動除外もしません。この結果はduplicate確定ではなくreview候補です。

## 演習

- 完全一致、表記違い、同じ話題だが別内容の3種類を追加する。
- thresholdを上下したときのprecisionとrecallを予想する。
- canonical文書を選ぶ規則と、人手reviewが必要な条件を書く。

説明できるようにする問い:

- 重複文書がretrievalと回答の根拠表示へどう影響するか。
- 類似度だけで自動削除してはいけないのはなぜか。

## 完了条件

- validatorが`PASS system30`を表示する。
- false positiveを現在の計算方法から説明できる。
- 候補検出、review、採用・除外を別工程として説明できる。

## 関連資料

- [要件定義](../../requirements/system30_requirements.md)
- [基本設計](../../basic_design/system30_basic_design.md)
- [詳細設計](../../detailed_design/system30_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
