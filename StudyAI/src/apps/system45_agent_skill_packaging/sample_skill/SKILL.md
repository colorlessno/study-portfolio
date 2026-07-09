# sample-review-skill

証拠に基づく小さな文書reviewを行うtaskで使うsample skill。

## 入力

- task goal
- 対象file
- 期待する出力

## 出力

- review summary
- findings
- residual risk

## 制約

- secret、token、password、個人dataは処理しない。
- 対象fileがない場合は停止する。
- scriptは決定的checkにだけ使う。

## 手順

1. task goalを読む。
2. 入力を検証する。
3. 関連するreferenceだけ読む。
4. findings と residual risk を出す。
