# web34 CORS成功・失敗サンプル

異なる origin のフロントエンドから API を呼び、ブラウザが通信を止める失敗状態と、API が origin を許可した成功状態を比較する。

## このテーマで身につけること

- origin を scheme、host、port の組み合わせとして説明する
- Same-Origin Policy と CORS の役割を区別する
- preflight の `OPTIONS` と実際の `POST` を Network タブで追う
- ブラウザの CORS エラーと、サーバー自体の障害を切り分ける

## 10分で再開する

前提は Node.js 20 以上。2つのターミナルを使う。

ターミナル1で、CORSを許可しない API を起動する。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web34_cors_success_failure
npm.cmd run backend:deny
```

ターミナル2でフロントエンドを起動する。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web34_cors_success_failure
npm.cmd run frontend
```

`http://localhost:3034/` を開き、DevTools の Console と Network タブを表示する。API は `http://localhost:3035/` で待ち受けるため、port が異なる cross-origin 通信になる。

## 失敗から成功へ切り替える

1. `backend:deny` の状態で `call backend` を押し、CORS エラーを確認する
2. Network タブで `OPTIONS` を探し、response に許可 header がないことを見る
3. ターミナル1の API を `Ctrl+C` で停止する
4. 同じターミナルで許可設定の API を起動する

```powershell
npm.cmd run backend:allow
```

5. ブラウザでもう一度ボタンを押し、JSON が表示されることを確認する
6. `OPTIONS` と `POST` の response header に `Access-Control-Allow-*` があることを見る

短い確認手順は [CORS失敗確認](docs/cors_failure.md) と [CORS成功確認](docs/cors_success.md) にも分けてある。

## コードを読む順番

1. `frontend/src/server.js` で、3034 から 3035 へ `fetch` している箇所を見る
2. `Content-Type: application/json` を付けた POST が preflight の対象になることを確認する
3. `backend/src/server.js` の `ALLOW_CORS` で、deny / allow を切り替える仕組みを見る
4. `headers` 関数で、許可する origin、header、method を確認する
5. `OPTIONS` の 204 response と、通常 response の違いを見る

## 観察ポイント

- CORS は API が動いているかどうかではなく、ブラウザが response を利用してよいかを判断する仕組みである
- deny 時でも API プロセスは起動している。Console、Network、サーバーログを分けて見る
- `curl` はブラウザの Same-Origin Policy を適用しないため、CORS header がなくても response を表示できる
- `Access-Control-Allow-Origin` は、このサンプルでは `http://localhost:3034` だけを許可する
- web35 も port 3035 を使うため、次のテーマへ進む前に web34 の API を停止する

現状の実装は origin と preflight の比較に絞っている。credentials 付き CORS と `Access-Control-Allow-Credentials` は要件にある次の発展課題で、まだ実装していない。

## 壊して確かめる

- allow 状態で `http://127.0.0.1:3034/` を開き、許可済みの `localhost` と別 origin になることを確認する
- `Access-Control-Allow-Headers` から `Content-Type` を外し、preflight の response と Console のエラーを比較する
- `Access-Control-Allow-Methods` から `POST` を外し、どの段階で失敗するか確認する
- `curl.exe -i http://localhost:3035/api/message` を実行し、ブラウザの結果と比較する

## 自分の言葉で説明する

- 3034 と 3035 が別 origin になるのはなぜか
- preflight は誰が、何を確認するために送るのか
- API が 200 を返せてもブラウザで失敗することがあるのはなぜか
- 全 origin を無条件に許可する設定にはどんな危険があるか

## 完了条件

- deny と allow の両方を自分で再現した
- Network タブで `OPTIONS` と `POST` の違いを確認した
- Console の CORS エラーと API 停止時の接続エラーを区別できる
- 現在のサンプルに credentials の実験が含まれていないことを説明できる
