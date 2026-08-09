# request と data の流れ

## flow template

| step | actor または component | action | 証拠 |
| ---: | --- | --- | --- |
| 1 | client | requestを送る | command、browser route、test |
| 2 | entry route | inputを読む | route file |
| 3 | service | ruleを適用する | service file |
| 4 | data layer | dataを読む/書く | SQL、repository、model |
| 5 | response | 結果を返す | response schema または rendered page |

## timing と state

stateが変わる場所を記録する。

- request内だけのstate
- process memory
- file state
- database state
- external dependency state

## 観察command

動作を証明する最小commandを使う。

```cmd
curl http://localhost:3000/health
```

実際に記入するときは、対象systemのcommandへ置き換える。
