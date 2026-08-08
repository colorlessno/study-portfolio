# system20 Context window experiment 学習ノート

## このテーマで学ぶこと

- context windowを超える入力では情報が欠落し得ること
- 重要情報の位置とtruncation方針が結果へ影響すること
- contextを「入る・入らない」だけでなく、残す情報の設計として考えること

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system20 --show-output
```

実行前に重要markerが保持されるか予想し、実行後に`estimated_tokens`、`truncated`、`retained_text`、`missing_markers`を確認してください。

## 観察ポイント

1. 既定入力がcontext limitを超え、`truncated`がtrueになることを確認する。
2. 重要markerを文頭と文末へ移動し、欠落判定を比較する。
3. 単純な先頭保持以外に、どんな入力圧縮・検索戦略があるか考える。

## この実装の境界

このテーマは推定token列の先頭だけを残す単純な切り詰めです。実model固有のtokenizer、system promptや会話履歴を含むtoken budget、model-nativeなtruncation動作は再現しません。

## 演習

- `context_limit`を10、40、100に変えて残る情報を記録する。
- 重要markerを末尾だけに置き、欠落を再現する。
- 「要約してから投入」「検索で必要部分だけ投入」の長所とリスクを比較する。

説明できるようにする問い:

- context window内に重要情報を残すため、入力をどう設計するか。
- 長いcontextを選べば問題がすべて解決する、とは限らないのはなぜか。

## 完了条件

- validatorが`PASS system20`を表示する。
- context limit、truncation、情報欠落の関係を説明できる。
- この実験と実modelの挙動の差を説明できる。

## 関連資料

- [要件定義](../../requirements/system20_requirements.md)
- [基本設計](../../basic_design/system20_basic_design.md)
- [詳細設計](../../detailed_design/system20_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
