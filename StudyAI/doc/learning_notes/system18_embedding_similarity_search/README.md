# system18 Embedding similarity search 学習ノート

## このテーマで学ぶこと

- queryとdocumentを数値で比較して順位付けする検索の基本形
- top-kとscoreを観察し、検索結果を評価する考え方
- 単語一致と意味的な近さは別物であること

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system18 --show-output
```

実行前に「返品したい」に最も近い文書を予想し、実行後に`result.results`の順序と`score`を確認してください。

## 観察ポイント

1. 結果がscoreの降順になっていることを確認する。
2. `top_k`を1と3に変え、取得件数と順位の役割を分けて考える。
3. 同義語だけを含む文書を追加し、単語一致方式の限界を観察する。

## この実装の境界

このテーマの「embedding」は、文字・単語の重なりから作る局所的な類似度で代用しています。実embedding modelの意味ベクトルやsemantic searchの品質を再現していません。実案件ではmodel、正規化、距離関数、index、評価dataを揃えて比較します。

## 演習

- queryを「商品を返したい」に変え、順位が期待どおりか確認する。
- 無関係な文書と、表現だけ異なる正解文書を追加してfailure caseを作る。
- 正解document IDを先に決め、hit@kで評価する方法を考える。

説明できるようにする問い:

- scoreが高いことと、利用者の質問に答えられることはなぜ同義ではないか。
- lexical searchとembedding searchをどう使い分け、または組み合わせるか。

## 完了条件

- validatorが`PASS system18`を表示する。
- query、score、ranking、top-kの関係を説明できる。
- この結果を実embeddingの性能評価として扱えない理由を説明できる。

## 関連資料

- [要件定義](../../requirements/system18_requirements.md)
- [基本設計](../../basic_design/system18_basic_design.md)
- [詳細設計](../../detailed_design/system18_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
