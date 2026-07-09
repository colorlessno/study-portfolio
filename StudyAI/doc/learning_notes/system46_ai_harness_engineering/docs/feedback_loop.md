# feedback loop 改善循環

## 流れ

1. fixtureを作る。
2. AIまたはmockが出力を作る。
3. check scriptで形式と禁止操作を確認する。
4. 失敗した場合はfixture、prompt、checkのどれが原因か分ける。
5. 修正後に同じfixtureで再実行する。

## 改善単位

| 問題 | 改善対象 |
| --- | --- |
| 入力が曖昧 | fixture |
| 出力形式がぶれる | prompt / expected output |
| 禁止操作を拾えない | check script |
| 人間判断が必要 | approval boundary |
