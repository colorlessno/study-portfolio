# Query Log Comparison

| Mode | 親件数 | Query count | Response result |
|---|---:|---:|---|
| `n_plus_one` | 3 | 4 | usersとtasks |
| `optimized` | 3 | 2 | 同じusersとtasks |

```powershell
curl.exe -s "http://localhost:3050/?mode=n_plus_one"
curl.exe -s "http://localhost:3050/?mode=optimized"
```

## 実DB版で記録すること

- SQLとparameter
- query実行回数
- 各queryのduration
- 取得row数
- endpoint全体のduration
- 親件数を増やしたときの変化

このサンプルの`queries`は疑似counterであり、DB logではない。ORM版ではSQL loggingやAPMを使って実際の発行queryを確認する。
