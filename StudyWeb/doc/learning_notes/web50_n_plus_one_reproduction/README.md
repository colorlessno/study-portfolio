# web50 N+1問題の再現

親3件と子3件のローカルデータを使い、親一覧1回＋親ごとの子取得N回というN+1構造と、親・子をまとめて取得する構造の疑似query回数を比較する Node.js サンプル。

## このテーマで身につけること

- N+1の「1」と「N」が何のqueryか説明する
- 一覧取得時のrelation loadingがquery数を増やす理由を理解する
- eager loading・batch取得でquery回数を一定にする考え方を学ぶ
- ORMの見た目だけでなくSQL log・query countを確認する

## 10分で再開する

前提は Node.js 20 以上。依存パッケージはなく、`npm install`は不要。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web50_n_plus_one_reproduction
npm.cmd start
```

別のターミナルで比較する。終了は`Ctrl+C`、構文確認は`npm.cmd run build`。

```powershell
curl.exe -s "http://localhost:3050/?mode=n_plus_one"
curl.exe -s "http://localhost:3050/?mode=optimized"
```

比較方法は [Query Log Comparison](docs/query_log_comparison.md)、問題構造は [N+1 Note](docs/n_plus_one_note.md) を参照する。

## 期待する比較

| Mode | 疑似query数 | 構造 |
|---|---:|---|
| `n_plus_one` | 4 | user一覧1回＋userごとにtasks 3回 |
| `optimized` | 2 | user一覧1回＋tasksまとめ取得1回 |

どちらも同じuser・task結果を返す。違いは結果ではなく取得方法とquery数。

## コードを読む順番

1. usersとtasksの親子関係を`userId`で確認する
2. queryのmodeと既定`n_plus_one`を見る
3. `queries = 1`が親一覧取得を表すことを確認する
4. n_plus_one分岐でuserごとにquery数を増やす構造を見る
5. optimized分岐がquery数2で固定されることを見る
6. responseのmode、queries、resultを比較する

## 現実装の範囲

- DB・ORM・SQLは使わず、配列filterとcounterでquery構造を模擬する
- 実行時間・通信量・DB loadは計測しない
- userは3件固定で、Nが増えたときの比例増加を実データで測らない
- eager loadingのSQLやJOIN、IN queryは実装しない
- `mode=optimized`以外はすべてN+1側で処理する

query数を理解する概念サンプルであり、DB性能改善を実測したものではない。

## 壊して確かめる

- usersを100件に増やし、N+1のqueriesが101になることを確認する
- tasksが0件のuser Cでも子取得queryが発生する理由を考える
- modeの未知値を400にする
- 各queryを表す疑似logを配列で返す
- ORM / DB版を作り、SQL logで実際のquery回数を確認する
- JOINと2-query batch取得のresponse重複・組立て方を比較する

## 自分の言葉で説明する

- 親がN件のとき、なぜqueryが1+N回になるか
- 子が0件の親にもqueryが発生する可能性があるのはなぜか
- eager loadingでquery回数を減らしても注意すべき点は何か
- 小さい開発データでは見逃しやすいのはなぜか

## 完了条件

- 4 queriesと2 queriesを比較した
- 両modeのresultが同じことを確認した
- 親件数を増やしてquery数の増加を説明した
- 実DB版ではSQL logで確認すべきだと説明できる
