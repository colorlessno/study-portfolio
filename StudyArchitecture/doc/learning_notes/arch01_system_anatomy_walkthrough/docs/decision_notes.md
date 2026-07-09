# 構成判断メモ

## template

| 判断 | 証拠 | tradeoff | 代替案 |
| --- | --- | --- | --- |
| serviceを1つにする | compose file | local setupが簡単 | frontend/backendを分ける |
| DB volumeを使う | compose file | local stateが残る | 毎回seedする |
| server renderingを使う | framework route | 初回表示が速い | SPAでload後にfetchする |

## 必須メモ

1. runtime形状に関する判断。
2. data ownershipに関する判断。
3. verificationに関する判断。
4. scaleしたら変わる判断。

## 品質基準

良い判断メモは、なぜ現在の形が観察された制約に合うかを説明する。存在するfileを列挙するだけでは不十分。
