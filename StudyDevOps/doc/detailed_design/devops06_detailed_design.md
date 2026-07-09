# devops06 詳細設計

## request id付きログ

## 1. 実装配置

```text
src/apps/devops06_request_id_logging/
  README.md
  app/package.json
  app/server.js
  app/logger.js
  tests/logging.test.js
  Dockerfile
```

## 2. header / log設計

| 項目 | 値 |
|---|---|
| request header | `X-Request-Id` 任意 |
| response header | `X-Request-Id` 必須 |
| generated id | UUID |
| log format | JSON line |

## 3. log fields

| field | 内容 |
|---|---|
| `timestamp` | ISO-8601 |
| `level` | info / error |
| `request_id` | request単位ID |
| `method` | HTTP method |
| `path` | request path |
| `status` | response status |
| `duration_ms` | 処理時間 |

## 4. endpoint

| path | 用途 |
|---|---|
| `/ok` | 正常ログ |
| `/fail` | 例外ログ |
| `/health` | smoke |

## 5. 検証コマンド

```powershell
docker build -t studydevops-devops06 .\src\apps\devops06_request_id_logging
docker run --rm -p 18086:8080 studydevops-devops06
curl -i http://localhost:18086/ok
docker logs <container>
```

CI では API smoke と log format assertion を別 step とし、失敗時に request id を確認する。

## 6. 安全性

- secrets、password、token、個人情報をログに出さない。
- request body 全文をログに残さない。
- テキストファイルは UTF-8 BOMなしで保存する。
