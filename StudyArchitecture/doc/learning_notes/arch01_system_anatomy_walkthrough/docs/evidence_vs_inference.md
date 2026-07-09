# 証拠と推測

## 証拠

直接観察できるもの。

- file content
- config value
- command output
- log line
- API response
- browser behavior

## 推測

証拠から導いた結論。

- このserviceは認証を担当していそう。
- このcacheはDB readの繰り返しを減らすためにありそう。
- このrouteはAPI clientではなくbrowser navigation向けに見える。

## 表

| 主張 | 種別 | source |
| --- | --- | --- |
| appが `/health` を公開している | 証拠 | route file または curl |
| DBがstartupに必要 | 証拠または推測 | startup logs または config |
| splitはdeployしやすさを上げる | 推測 | structureから説明 |

## ルール

推測を消す必要はない。推測として明記し、それを確認または否定する証拠を決める。
