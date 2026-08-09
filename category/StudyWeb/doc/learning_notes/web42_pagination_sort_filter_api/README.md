# web42 pagination / sort / filter API

30件のローカルデータを返す Node.js API を使い、keyword・statusによるfilter、sort、limit / offset pagination、response metadataを組み合わせて観察する。

## このテーマで身につけること

- query parameterをAPIへの入力として読み取る
- filter → sort → paginationの処理順を説明する
- `total`、`limit`、`offset`から画面のページ情報を組み立てる
- 不正なqueryを検出し、400にするためのvalidationを設計する

## 10分で再開する

前提は Node.js 20 以上。依存パッケージはなく、`npm install` は不要。

```powershell
cd category/StudyWeb\src\backend\src\studyweb\systems\web42_pagination_sort_filter_api
npm.cmd test
npm.cmd start
```

別のターミナルから `http://localhost:3042/items` を呼ぶ。終了は `Ctrl+C`。

```powershell
curl.exe -i "http://localhost:3042/items"
curl.exe -i "http://localhost:3042/items?status=open&sort=createdAt&order=desc&limit=5&offset=0"
```

自動テストはephemeral portで正常な組合せと不正queryを確認する。構文確認は `npm.cmd run build` で行える。

## 最初に試す順番

1. queryなしで呼び、30件中10件とmetadataが返ることを確認する
2. `keyword=1` でnameを部分一致検索する
3. `status=open` と `status=closed` の件数を比較する
4. `sort=createdAt&order=desc` で並び順を確認する
5. `limit=5&offset=5` で2ページ目相当を取得する
6. すべてを組み合わせ、処理順をresponseから説明する

パラメータ仕様は [Query Parameters](docs/query_parameters.md)、response例は [Response Format](docs/response_format.md) を参照する。

## コードを読む順番

1. `items` で30件のデータ構造と生成規則を見る
2. `url.parse(req.url, true)` でqueryをオブジェクトへ変換する箇所を見る
3. `limit` と `offset` の初期値・整数・範囲validationを見る
4. `status`、`sort`、`order`のallowlistを見る
5. keywordとstatusのfilter条件を読む
6. sort方向の計算と、最後の `slice` を追う
7. `items` と `meta` を同じresponseで返す箇所を見る

## 現在のAPI仕様

| 入力 | 現在の動作 |
|---|---|
| queryなし | 先頭10件、`total=30` |
| `keyword` | nameの部分一致、大文字小文字を区別しない |
| `status` | 完全一致 |
| `sort` | `name / status / createdAt`を文字列として比較 |
| `order` | `asc` / `desc`、それ以外は400 |
| `limit` | 既定10、1〜50の整数以外は400 |
| `offset` | 既定0、0以上の整数以外は400 |
| `method` | `GET`だけを許可し、それ以外は405 |

## 自動テストで固定する境界

次の入力を400として区別し、filter → sort → paginationの順序をresponseで確認する。

- `limit`と`offset`の形式・範囲違反
- 未知の`status`と`sort`
- `asc / desc`以外の`order`
- `GET`以外のmethodは405

未知query parameter、keyword長、page・totalPages、実DBのsort・indexは引き続き発展課題とする。

## 壊して確かめる

- `order=sideways`、`limit=abc`、`offset=-1`、`sort=unknown`を送り、error codeを比較する
- 未知query parameterを無視するか拒否するか方針を決める
- keywordの長さ上限と正規化を追加する
- `page` と `totalPages` をmetadataへ追加し、0件時の扱いを決める

## 自分の言葉で説明する

- filter、sort、paginationはどの順番で適用するべきか
- `total`は返却した`items.length`と何が違うか
- limitに上限が必要なのはなぜか
- 「検索結果0件」と「query parameter不正」を分ける理由は何か

## 完了条件

- filter、sort、limit / offsetを単独・組合せで確認した
- 自動テストで正常系と不正queryを確認した
- metadataから現在の表示範囲を説明できる
- status、sort、order、limit、offsetのvalidation結果を説明できる
