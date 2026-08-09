# 証拠選定

## 証拠の種類

| 証拠 | 良い使い方 |
| --- | --- |
| screenshot | userに見える結果 |
| command output | CLIまたはDocker検証 |
| test result | regression confidence |
| diagram | architecture説明 |
| source file | 実装detail |
| README | 実行方法 |

## 証拠ルール

主張を証明する最小の証拠を使う。

悪い例:

```text
これは本番readyです。
```

良い例:

```text
local smoke test はhappy pathで通っています。現在の制限はmulti-user behaviorを未検証な点です。
```
