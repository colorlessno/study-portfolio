# system19 Attention demo 学習ノート

## このテーマで学ぶこと

- token同士の関係を行列として表す見方
- focus tokenを基準に、他tokenへの重みを読む方法
- 可視化した数値とmodel内部の根拠を混同しないこと

## 15分で再開する

リポジトリルートで実行します。外部package、API key、DBは不要です。

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system19 --show-output
```

実行前に、既定文のどの単語同士が強く関連すると期待するかをメモし、実行後に`tokens`、`attention_matrix`、`focus_relations`を確認してください。

## 観察ポイント

1. 行列がtoken数と同じ行数・列数を持つことを確認する。
2. focus indexを変え、どの行が`focus_relations`になるか確認する。
3. 近い位置のtokenほど値が高くなる実装をコードで特定する。

## この実装の境界

表示する行列は、token間の位置と同一文字を使って合成した値です。Transformerが学習したattention weightではなく、modelの判断理由も示しません。実modelのattentionを扱う場合も、可視化だけから因果関係を断定しないようにします。

## 演習

- 同じtokenが二度出る文へ変更し、値の変化を観察する。
- focus indexを先頭、中央、末尾に変えて比較する。
- 行列から「意味を理解した」と断定できない理由を挙げる。

説明できるようにする問い:

- attention matrixの行と列は何を表すか。
- attentionの可視化を説明可能性そのものとして扱うと何が危険か。

## 完了条件

- validatorが`PASS system19`を表示する。
- token数と正方行列の関係を説明できる。
- 合成値と実modelのattention weightを区別できる。

## 関連資料

- [要件定義](../../requirements/system19_requirements.md)
- [基本設計](../../basic_design/system19_basic_design.md)
- [詳細設計](../../detailed_design/system19_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
