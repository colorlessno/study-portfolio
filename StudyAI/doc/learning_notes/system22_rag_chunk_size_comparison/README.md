# system22 RAG chunk size comparison 学習ノート

## このテーマで学ぶこと

- RAGで文書をchunkへ分割する理由
- chunk sizeとoverlapが情報のまとまり、重複、件数へ与える影響
- retrieval品質とanswer品質を分けて評価する必要性

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system22 --show-output
```

実行前に何個のchunkができるか予想し、実行後に`chunks`、`chunk_count`、`evaluation_notes`を確認してください。

## 観察ポイント

1. chunk size 12、overlap 3のとき、次の開始位置が9文字ずつ進むことを確認する。
2. chunk境界で意味のまとまりが切れていないか確認する。
3. overlapを増やした場合の証拠保持とindex量のtrade-offを考える。

## この実装の境界

このテーマは文字数で機械的にsliceする概念実験です。token単位、文・見出し単位、意味単位の分割ではなく、embedding、vector検索、回答生成も行いません。chunkの見た目だけでRAG全体の品質を判断せず、retrievalとanswerを別々に評価します。

## 演習

- chunk sizeとoverlapを3通り変え、chunk数と重複量を表にする。
- 重要な一文が境界をまたぐ文書を作り、overlapの効果を確認する。
- queryと正解chunkを定義し、hit@kで比較する次の実験を設計する。

説明できるようにする問い:

- chunkを小さくしすぎた場合と大きくしすぎた場合に何が起こるか。
- retrievalが成功しても最終回答が正しいとは限らないのはなぜか。

## 完了条件

- validatorが`PASS system22`を表示する。
- chunk size、overlap、step、chunk countの関係を説明できる。
- この実験だけでは検索・回答品質を証明できないと説明できる。

## 関連資料

- [要件定義](../../requirements/system22_requirements.md)
- [基本設計](../../basic_design/system22_basic_design.md)
- [詳細設計](../../detailed_design/system22_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
