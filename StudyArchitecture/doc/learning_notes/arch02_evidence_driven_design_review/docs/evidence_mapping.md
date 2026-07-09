# 証拠mapping

## 主張map

| 主張 | 証拠 | confidence | 未解決の問い |
| --- | --- | --- | --- |
| serviceはDBを必要とする | compose env、app config | 高 | DBなしでstartup失敗するか |
| routeはinput validationする | schema file | 中 | testで確認しているか |
| logで診断できる | log output | 低 | correlation IDがあるか |

## confidence

| level | 意味 |
| --- | --- |
| 高 | 直接証拠で主張を確認できる |
| 中 | 証拠はあるがruntime checkが不足している |
| 低 | 構造からの推測のみ |

## ルール

新しい証拠なしにconfidenceを上げない。
