# web32 HTTPヘッダー観察詳細設計
## 0. 関連文書

- `../requirements/web32_http_headers_requirements.md`
- `../basic_design/web32_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web32_http_headers/
  Dockerfile
  package.json
  server/src/server.js
doc/learning_notes/web32_http_headers/
  README.md
  docs/devtools_check.md
  docs/curl_check.md
  docs/observation_log.md
```

## 2. 主要設計
| 区列| 内容|
|---|---|
| API | `GET /api/hello`, `POST /api/echo` |
| Header | `Content-Type`, `X-Study-Request-Id` |
| Client | serverがある信する学習用HTMLからfetchでGET/POSTを実行|
| 確認| DevTools Network と curl の比較|

## 3. 確認手順
1. serverを起動する2. clientをブラウザで開く
3. GET/POSTボタンを実行する4. DevTools Networkでheaders/payload/responseを見る
5. curlで同じAPIを実行する
## 4. 完了条件

- GET/POSTのheader/body/statusを確認できる
- DevToolsとcurlの結果を記録できる
- 観察ログが成されてい

