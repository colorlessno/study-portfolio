# web32 HTTPヘッダー観察

Node.js 標準の `http` モジュールだけで作ったサーバーを使い、request / response、header、body、status code の関係をブラウザと `curl` の両方から観察する。

## このテーマで身につけること

- HTTP 通信を method、URL、header、body、status code に分けて説明する
- DevTools の Network タブから、画面の裏で発生した通信を調べる
- `curl` で API を単体確認し、ブラウザでの確認結果と比較する
- クライアントが送る情報と、サーバーが返す情報を区別する

## 10分で再開する

前提は Node.js 20 以上。リポジトリルートから実行ディレクトリへ移動する。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web32_http_headers
npm.cmd start
```

起動後に `http://localhost:3032/` を開く。終了するときは、起動したターミナルで `Ctrl+C` を押す。

依存パッケージはなく、`npm install` は不要。構文だけ確認したい場合は次を実行する。

```powershell
npm.cmd run build
```

## コードを読む順番

1. `server/src/server.js` の `createServer` で、URL と method による分岐を見る
2. `GET /api/hello` で、request header が response body に含まれる流れを見る
3. `POST /api/echo` と `readBody` で、body が分割して届く可能性を見る
4. `json` 関数で、status と response header を設定する場所を見る
5. 最後の 404 分岐で、どの route にも一致しない場合を確認する

## 手を動かす

### 1. ブラウザで観察する

1. DevTools の Network タブを開く
2. 画面の `GET` を押し、`/api/hello` の Headers と Response を見る
3. 画面の `POST` を押し、`/api/echo` の Headers、Payload、Response を見る
4. response header の `X-Study-Request-Id` がリクエストごとに変わることを確認する

詳しい操作は [DevTools確認](docs/devtools_check.md) を参照する。

### 2. curlで同じAPIを呼ぶ

別のターミナルで次を実行する。

```powershell
curl.exe -i http://localhost:3032/api/hello
curl.exe -i -X POST http://localhost:3032/api/echo -H "Content-Type: application/json" -d "{\"message\":\"hello\"}"
```

ブラウザが付ける header と `curl` が付ける header の違いを [観察ログ](docs/observation_log.md) に記録する。コマンドだけ見直したい場合は [curl確認](docs/curl_check.md) を使う。

## 観察ポイント

- `X-Client: browser` は GET ボタンの JavaScript が明示的に追加している
- `Content-Type` は「送ったデータの形式」を相手に伝える header である
- POST の body は文字列として読み取られ、このサンプルでは JSON として検証されない
- response body に request header を入れているのは観察用であり、本番 API の一般的な設計ではない
- 存在しない URL は 404 と `{ "error": "not_found" }` を返す

## 壊して確かめる

変更前の結果を記録してから、1項目ずつ試す。

- GET の `X-Client` を別の値に変え、response body へ反映されるか確認する
- POST から `Content-Type` を外し、Payload と request header がどう変わるか確認する
- `http://localhost:3032/api/missing` を呼び、200 と 404 の違いを確認する
- JSON ではない文字列を `/api/echo` に送り、それでも 200 になる理由をコードから説明する

## 自分の言葉で説明する

- request header と response header は、誰が誰に送る情報か
- GET と POST で body の扱いがどう違うか
- DevTools と `curl` は、それぞれどんな調査に向くか
- status code と response body の両方を確認する理由は何か

## 完了条件

- GET / POST の method、header、body、status を指し示せる
- DevTools と `curl` の結果を比較して、少なくとも2つの違いを記録した
- 404 と、JSON を検証していない現在の実装を説明できる
- [観察ログ](docs/observation_log.md) を自分の結果で埋めた
