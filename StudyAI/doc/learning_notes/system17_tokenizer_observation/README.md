# system17 Tokenizer observation 学習ノート

## このテーマで学ぶこと

- 文字数とtoken数は同じではないこと
- 日本語、英語、記号、改行で分割結果が変わること
- context limitを考えるときは、対象modelのtokenizerを確認する必要があること

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python StudyAI\scripts\validate-ai-learning.py system17 --show-output
```

実行前に「日本語と英語のどちらが細かく分割されるか」を予想し、実行後に`char_count`、`estimated_tokens`、`token_segments`を比較してください。

## 観察ポイント

1. `input.text`の文字数と`result.estimated_tokens`の差を確認する。
2. 空白、句読点、英数字が`token_segments`でどう分割されたか確認する。
3. `context_limit`を小さくした場合に`over_limit`がどう変わるか予想する。

## この実装の境界

このテーマは正規表現による分割結果を「推定token」として表示する概念実験です。GPT、Claudeなどの実modelが使うtokenizerの結果ではありません。実案件で料金、context長、切り詰め位置を判断する場合は、採用modelと同じtokenizerで再計測します。

## 演習

- 入力を日本語だけ、英語だけ、日英混在の3種類に変えて差を記録する。
- 絵文字、URL、コード断片を追加し、推定の弱点を説明する。
- 実modelのtokenizerに置き換えるなら、どの層を差し替えるかコードから探す。

説明できるようにする問い:

- なぜ文字数だけではcontext超過を判定できないか。
- この実験結果を実modelのtoken数だと言ってはいけないのはなぜか。

## 完了条件

- validatorが`PASS system17`を表示する。
- 文字数、推定token数、context limitの関係を自分の言葉で説明できる。
- シミュレーション結果と実modelで確認した事実を区別できる。

## 関連資料

- [要件定義](../../requirements/system17_requirements.md)
- [基本設計](../../basic_design/system17_basic_design.md)
- [詳細設計](../../detailed_design/system17_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
