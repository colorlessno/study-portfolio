# web35 HTTPスステータス設計詳細設計
## 0. 関連文書

- `../requirements/web35_http_status_design_requirements.md`
- `../basic_design/web35_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web35_http_status_design/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web35_http_status_design/
  README.md
  docs/status_code_matrix.md
  docs/curl_examples.md
```

## 2. 主要設計
| Status | Endpoint例| 用途|
|---|---|---|
| 200 | `GET /items` | 取得の力|
| 201 | `POST /items` | 成成功 |
| 400 | `POST /items` 不正body | 入力エラー |
| 401 | `GET /private` headerない| 未認証 |
| 403 | `GET /admin` | 権限不足 |
| 404 | `GET /items/:id` 未存在 | 未存在 |
| 409 | duplicate key | 競各|
| 500 | `GET /error` | サーバーエラー例|

## 3. 確認手順
1. 各ndpointをcurlで呼ぶ
2. statusとbodyを記録する
3. 401/403/404の違いを確認する4. 500で内容情報があるないとを確認する
## 4. 完了条件

- 主要statusを使い分けられる
- error bodyがある通形式になってい
- curl確認例がある

