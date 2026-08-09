# web42 pagination / sort / filter API 詳細設計

## 0. 関連文書

- `../requirements/web42_pagination_sort_filter_api_requirements.md`
- `../basic_design/web42_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web42_pagination_sort_filter_api/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web42_pagination_sort_filter_api/
  README.md
  docs/query_parameters.md
  docs/response_format.md
```

## 2. Endpoint

| Method | Path | 内容 |
|---|---|---|
| GET相当 | `/items` | filter・sort・pagination付き一覧 |
| 任意 | その他 | 404 `not_found` |

現在はHTTP methodを検証していないため、`/items`ならGET以外でも一覧処理へ進む。GETだけに限定することが改善項目。

## 3. データ

| 項目 | 型 | 内容 |
|---|---|---|
| `id` | number | 1〜30 |
| `name` | string | `Item 1`等 |
| `status` | string | `open` / `closed` |
| `createdAt` | string | `2026-04-DD` |

ローカル配列で完結し、DBは使用しない。

## 4. Query Parameter

| Query | 既定・現在の処理 |
|---|---|
| `keyword` | 未指定なら全件、name部分一致 |
| `status` | 未指定なら全件、完全一致 |
| `sort` | 未指定なら生成順、指定propertyで比較 |
| `order` | 実質asc、`desc`で降順 |
| `limit` | 既定10、1〜50へ補正 |
| `offset` | 既定0、負数は0へ補正 |

## 5. 処理手順

1. URLをpathnameとqueryへ分解する。
2. pathnameが`/items`以外なら404を返す。
3. limit・offsetを数値化し、範囲を補正する。
4. orderが指定済みで`asc / desc`以外なら400を返す。
5. keyword・statusでfilterする。
6. sort指定時は対象propertyを文字列として比較する。
7. offsetからlimit件をsliceする。
8. `items`と`total / limit / offset`を返す。

## 6. Response

| Status | 条件 | Body |
|---:|---|---|
| 200 | 一覧取得 | `items`, `meta` |
| 400 | order不正 | `invalid_order` |
| 404 | path不一致 | `not_found` |

`meta.total`はfilter後・pagination前の件数。

## 7. 要件との差分・既知の課題

- limit・offsetの非数値、未知のstatus・sort keyを400にしない。
- sort keyをwhitelistで制限していない。
- methodをGETへ限定していない。
- page・totalPages等は返さない。
- in-memory 30件のため、DB query・index・大量データ性能は再現しない。

## 8. 確認手順

1. queryなしで先頭10件とtotal 30を確認する。
2. keyword・statusを単独・組合せで指定する。
3. sort・orderで並び順を比較する。
4. limit・offsetで取得範囲を変える。
5. 不正orderの400と、その他の未検証値を比較する。

## 9. 完了条件

- filter / sort / paginationを組み合わせられる。
- total / limit / offsetの意味を説明できる。
- 不正queryを400として検出する範囲を改善できる。
- filter → sort → paginationの順番を説明できる。
