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
cd StudyWeb\src\backend\src\studyweb\systems\web42_pagination_sort_filter_api
npm.cmd start
```

別のターミナルから `http://localhost:3042/items` を呼ぶ。終了は `Ctrl+C`。

```powershell
curl.exe -i "http://localhost:3042/items"
curl.exe -i "http://localhost:3042/items?status=open&sort=createdAt&order=desc&limit=5&offset=0"
```

構文確認は `npm.cmd run build` で行える。

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
3. `limit` と `offset` の初期値・範囲補正を見る
4. `order` だけを400で拒否するvalidationを見る
5. keywordとstatusのfilter条件を読む
6. sort方向の計算と、最後の `slice` を追う
7. `items` と `meta` を同じresponseで返す箇所を見る

## 現在のAPI仕様

| 入力 | 現在の動作 |
|---|---|
| queryなし | 先頭10件、`total=30` |
| `keyword` | nameの部分一致、大文字小文字を区別しない |
| `status` | 完全一致 |
| `sort` | 指定したpropertyを文字列として比較 |
| `order` | `asc` / `desc`、それ以外は400 |
| `limit` | 既定10、1〜50へ補正 |
| `offset` | 既定0、0未満は0へ補正 |

## 実装と要件の差

現実装で明示的に拒否する不正queryは `order` だけである。

- `limit=abc` や `offset=abc` は400にならず、`NaN`がJSONで`null`になる場合がある
- 未知のstatusは0件として扱われ、入力誤りと区別できない
- 未知のsort keyも拒否されない
- `sort` だけ指定した場合のorderは実質ascだが、仕様として明記していない
- HTTP methodを判定していないため、`POST /items` でも一覧を返す
- metadataは`total / limit / offset`だけで、page・totalPagesは返さない

これらはvalidation設計を考えるための発展課題として扱う。

## 壊して確かめる

- `order=sideways` を送り、400と`invalid_order`を確認する
- `limit=abc`、`offset=abc`、`sort=unknown`を送り、現在の不十分なvalidationを記録する
- `status` を `open / closed` のwhitelistで検証する
- sort keyを `name / status / createdAt` に限定する
- `limit` と `offset` を整数として検証し、範囲外と形式不正を分ける
- `page` と `totalPages` をmetadataへ追加し、0件時の扱いを決める

## 自分の言葉で説明する

- filter、sort、paginationはどの順番で適用するべきか
- `total`は返却した`items.length`と何が違うか
- limitに上限が必要なのはなぜか
- 「検索結果0件」と「query parameter不正」を分ける理由は何か

## 完了条件

- filter、sort、limit / offsetを単独・組合せで確認した
- metadataから現在の表示範囲を説明できる
- 不正なorderの400と、未検証parameterの挙動を比較した
- status、sort、limit、offsetのvalidationを1つ以上改善した
