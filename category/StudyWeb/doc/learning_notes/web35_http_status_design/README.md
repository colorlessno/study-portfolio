# web35 HTTPステータス設計

正常、作成、入力不備、未認証、権限不足、未存在、競合、サーバーエラーを返す小さな API を使い、status code を API の契約として読み分ける。

## このテーマで身につけること

- 200 と 201、401 と 403、404 と 409 を使い分ける
- status code と error response body の両方から失敗原因を判断する
- エラー形式を揃えることが API 利用者に与える利点を説明する
- 500 response に内部のスタックトレースを出さない理由を理解する

## 10分で再開する

前提は Node.js 20 以上。web34 の API も port 3035 を使うため、起動している場合は先に停止する。

```powershell
cd category/StudyWeb\src\backend\src\studyweb\systems\web35_http_status_design
npm.cmd start
```

別のターミナルで API を確認する。終了は `Ctrl+C`。

```powershell
curl.exe -i http://localhost:3035/items
curl.exe -i -X POST http://localhost:3035/items
curl.exe -i http://localhost:3035/private
curl.exe -i http://localhost:3035/admin
```

全 endpoint の対応表は [Status Code Matrix](docs/status_code_matrix.md)、短いコマンド集は [curl examples](docs/curl_examples.md) を参照する。

## コードを読む順番

1. `api/src/server.js` の `send` 関数で、status と JSON body の設定箇所を見る
2. `GET /items` と `POST /items` で 200 / 201 を比較する
3. 400、401、403、404、409 の分岐と error code を対応付ける
4. `/error` の 500 body に内部情報が含まれないことを見る
5. 最後の route not found と、`/items/999` の resource not found を比較する

## 全ケースを観察する

次の各 URL を `curl.exe -i` で呼び、status、`error.code`、`error.message` を表に記録する。

| 意図 | 呼び出し | 期待するstatus |
|---|---|---:|
| 一覧取得 | `GET /items` | 200 |
| 新規作成 | `POST /items` | 201 |
| 入力不備 | `GET /bad-request` | 400 |
| 未認証 | `GET /private` | 401 |
| 権限不足 | `GET /admin` | 403 |
| 対象なし | `GET /items/999` | 404 |
| 競合 | `GET /duplicate` | 409 |
| 内部エラー | `GET /error` | 500 |

例:

```powershell
curl.exe -i http://localhost:3035/bad-request
curl.exe -i http://localhost:3035/items/999
curl.exe -i http://localhost:3035/duplicate
curl.exe -i http://localhost:3035/error
```

## 観察ポイント

- 401 は「認証されていない」、403 は「誰かは分かるが許可されていない」を表す
- 404 は route 自体がない場合と、route はあるが対象データがない場合の両方で使われることがある
- 409 は、request の形式ではなく現在のリソース状態と競合する場合に使う
- `error.code` はプログラムが分岐しやすい安定した値、`message` は人が理解する補足として扱える
- `/error` は実際の例外ではなく、500 の response 形式を観察するために意図的に返している

また、`POST /items` は body の検証や配列への追加を行わない学習用 stub である。201 を返すだけで実際に作成していない点は、本番 API なら修正が必要になる。

## 壊して確かめる

- 存在しない `/missing` と `/items/999` を呼び、同じ 404 でも message が違う理由を考える
- `/private` の status を 403 に変え、クライアントが誤解する内容を説明する
- 400 の response だけ error body の形を変え、利用側の処理が複雑になる理由を考える
- 新しい 422 の endpoint を追加し、400 とどう使い分けるか自分の判断を記録する

## 自分の言葉で説明する

- 200 と 201 は何が違うか
- 401 と 403 を入れ替えると、利用者やクライアントにどんな誤解を与えるか
- 404 と 409 は、対象の存在と状態をどう表しているか
- 500 body に例外メッセージやスタックトレースをそのまま出してはいけない理由は何か

## 完了条件

- 8種類の response を呼び、status と body を記録した
- 401 / 403、404 / 409 の違いを例付きで説明できる
- 共通 error body に必要な項目を自分なりに整理した
- 現在の 201 と 500 が動作観察用の stub であることを説明できる
