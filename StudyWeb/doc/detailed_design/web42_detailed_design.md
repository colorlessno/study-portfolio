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

## 2. 主要設計
| Query | 内容|
|---|---|
| `keyword` | 部列致 |
| `status` | 状態|
| `sort` | `name`, `createdAt` |
| `order` | `asc`, `desc` |
| `limit` | 1-50 |
| `offset` | 0以上|

## 3. 確認手順
1. queryなしで取得する2. filterを指定する3. sort/orderを指定する4. limit/offsetを指定する5. 不正queryでvalidation errorを確認する
## 4. 完了条件

- filter/sort/paginationが動く
- metadataが返る
- 不正queryを検出できる

