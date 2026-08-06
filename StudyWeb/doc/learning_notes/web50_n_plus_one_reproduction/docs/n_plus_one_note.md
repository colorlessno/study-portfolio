# N+1 Note

## 問題構造

```text
1 query: users一覧を取得
N query: userごとにtasksを取得
```

親が3件なら4回、100件なら101回になる。子が0件の親にも「子がないことを確認するquery」が発生し得る。

## 改善候補

| 方法 | 考え方 | 注意点 |
|---|---|---|
| eager loading | ORMへrelationを先に読むよう指定 | 不要なrelationまで取らない |
| JOIN | 1 SQLで親子を結合 | 親row重複と組立て |
| batch / IN | 親ID群の子をまとめて取得 | ID数・query size |
| DataLoader | request内でbatch・cache | cache範囲と整合性 |

query数を減らせば必ず速いとは限らない。実SQL、row数、転送量、実行計画、処理時間を測って判断する。
