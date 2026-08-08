# system23 Reranker comparison 学習ノート

## このテーマで学ぶこと

- 検索候補を取得する段階と、候補を再順位付けする段階の違い
- rerank前後の順位を同じ評価dataで比較する方法
- 順位改善と追加latency・costのtrade-off

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system23 --show-output
```

実行前に`返金条件`へ最も適合する候補を予想し、実行後に`before`と`after`の先頭を比較してください。

## 観察ポイント

1. exact phraseを含む候補へbonusが加わり、先頭へ移動することを確認する。
2. `score`表示自体はrerank bonus適用前の値であることをコードから確認する。
3. 正解順位、latency、costのどれを採用判断に使うか整理する。

## この実装の境界

初期scoreは局所的な文字重なり、rerankはexact phrase bonusだけの決定的シミュレーションです。vector検索やcross-encoder rerankerを実行しておらず、実modelの精度・latency・costは測定していません。

## 演習

- queryを直接含まない同義表現を候補へ追加し、順位を観察する。
- rerankで順位が悪化するfailure caseを考える。
- 正解文書を先に決め、MRRやnDCGで比較する設計を書く。

説明できるようにする問い:

- rerankerを全候補ではなくtop-kへ適用するのはなぜか。
- 順位が改善してもrerankerを採用しない判断はどんな場合か。

## 完了条件

- validatorが`PASS system23`を表示する。
- retrievalとrerankingの責務を説明できる。
- 合成bonusと実rerankerの評価結果を区別できる。

## 関連資料

- [要件定義](../../requirements/system23_requirements.md)
- [基本設計](../../basic_design/system23_basic_design.md)
- [詳細設計](../../detailed_design/system23_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
