# 制限メモ

## template

```text
現在の制限:
<このprojectがまだ扱っていないこと。>

なぜ重要か:
<広く使う場合の影響。>

次step:
<1つの具体的な改善または検証task。>
```

## 例

| 制限 | 良い次step |
| --- | --- |
| local Dockerだけ検証済み | CI smoke testを追加する |
| mock dataのみ | realistic seed と edge caseを追加する |
| single-user flowのみ | concurrent-session testを追加する |
| manual verificationのみ | automated regression checkを追加する |

## ルール

制限は、具体的で次stepがあればdemo上の弱点ではなく、判断力の証拠になる。
