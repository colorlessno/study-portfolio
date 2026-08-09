# system28 OCR result normalization 学習ノート

## このテーマで学ぶこと

- OCR出力をAIへ渡す前に正規化する理由
- 自動補正できるruleと、人手reviewが必要な曖昧さの境界
- 補正前後のdiffを監査証跡として残す考え方

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system28 --show-output
```

実行前に`O3`、連続空白、全角空白、全角数字がどう変化するか予想し、`normalized_text`と`diffs`を確認してください。

## 観察ポイント

1. 英字`O`が数字`0`へ、空白列が1文字へ変わることを確認する。
2. 全角数字`５６７８`は残ることを確認する。
3. 入力のすべての`O`を自動変換する危険性を考える。

## この実装の境界

実装済みruleは`O`の一括置換と空白整理だけです。入力にある`rules`を選択的に実行せず、全角数字変換、辞書、confidence、`review_flags`判定も未実装です。正規化済みだから正しい文字列とは限りません。

## 演習

- 商品名など英字`O`を保持すべきfalse correction caseを作る。
- 自動補正、候補提示、人手確認の3段階へruleを分類する。
- 要件の全角半角正規化と現在実装の差を説明するissue案を書く。

説明できるようにする問い:

- 正規化が検索qualityを改善する一方、原文を壊す可能性があるのはなぜか。
- before、after、rule、review結果を保存する必要は何か。

## 完了条件

- validatorが`PASS system28`を表示する。
- 実装済みruleと未実装ruleを区別できる。
- 自動補正と人手確認の境界を説明できる。

## 関連資料

- [要件定義](../../requirements/system28_requirements.md)
- [基本設計](../../basic_design/system28_basic_design.md)
- [詳細設計](../../detailed_design/system28_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
