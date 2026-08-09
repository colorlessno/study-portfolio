# web49 retry / timeout

即時成功、2秒遅延、一時的503、恒久的400を返す Node.js API。呼出側でtimeout・retry・上限・backoffを設計するための失敗パターンを再現する。

## このテーマで身につけること

- client側timeoutとserver側の遅いresponseを区別する
- retryしてよい一時失敗と、修正が必要な恒久失敗を分ける
- retry回数・待機時間・総処理時間に上限を持たせる
- 冪等性を確認してから再実行する理由を説明する

## 10分で再開する

前提は Node.js 20 以上。依存パッケージはなく、`npm install`は不要。

```powershell
cd category/StudyWeb\src\backend\src\studyweb\systems\web49_retry_timeout
npm.cmd start
```

APIは`http://localhost:3049/`。終了は`Ctrl+C`、構文確認は`npm.cmd run build`。

## 最初に試す順番

```powershell
curl.exe -i "http://localhost:3049/?mode=success"
curl.exe --max-time 1 -i "http://localhost:3049/?mode=slow"
curl.exe -i "http://localhost:3049/?mode=temporary"
curl.exe -i "http://localhost:3049/?mode=temporary"
curl.exe -i "http://localhost:3049/?mode=temporary"
curl.exe -i "http://localhost:3049/?mode=permanent"
```

- success: 即時200
- slow: serverは2秒後に200を返すが、clientが1秒でtimeout
- temporary: 2回503の後、3回目に200
- permanent: 400でretry対象外

方針は [Retry Policy](docs/retry_policy.md)、timeout確認は [Timeout Check](docs/timeout_check.md) を参照する。

## コードを読む順番

1. queryの`mode`と既定successを見る
2. slowで2秒後にresponseするtimerを見る
3. `temporaryCount`と3回ごとの成功条件を見る
4. temporaryの503 bodyに`retryable=true`があることを見る
5. permanentの400と`retryable=false`を見る
6. その他modeがsuccess扱いになる最後の分岐を見る

## 現実装の範囲

- serverは失敗パターンを返すだけで、retry clientを実装していない
- timeoutはAPI自身の設定ではなく、呼出側の`--max-time`等で発生させる
- temporaryCountは全requestで共有され、client・operationごとに分かれていない
- 2回503・3回目200を繰り返すだけで、確率的障害ではない
- `Retry-After` header、backoff、jitter、request logはない
- routeや未知modeを厳密にvalidationしない

## 壊して確かめる

- max retry 3のclientを作り、temporaryで成功することを確認する
- max retry 2では失敗で終了することを確認する
- permanent 400をretryしない分岐を作る
- 100ms、200ms、400msのexponential backoffを記録する
- retry可能なresponseへ`Retry-After`を追加する
- POSTをretryする前にidempotency keyが必要な理由をweb43と関連付ける

## 自分の言葉で説明する

- timeoutは誰が何秒待って打ち切る設定か
- 400と503でretry判断が違うのはなぜか
- retryに上限とbackoffが必要なのはなぜか
- retry対象の操作が冪等でない場合、どんな事故が起こるか

## 完了条件

- 4つのmodeを確認した
- slowをclient timeoutで打ち切った
- temporaryの503 → 200を確認した
- 上限付きretry clientまたは方針を作成した
