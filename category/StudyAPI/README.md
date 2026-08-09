# StudyAPI

Python標準ライブラリの `http.server` だけで、HTTP request、JSON validation、status code、local LLM中継、安全な既定値を観察する最小Web API教材です。

## 15分で学習を再開する

LM Studioを起動せず、実際のephemeral HTTP serverとmock upstreamで正常系・失敗系を検証する。

```cmd
cd StudyAPI
python -X utf8 -m unittest discover -s tests -p "test_*.py"
```

テスト実行前に1件選んでstatus codeとJSONを予想し、実行後にhandlerの分岐を説明する。

## 学習する通信経路

```text
HTTP client
  └─ StudyAPI (127.0.0.1:9898)
       ├─ /health, /fixed  LM Studio不要
       └─ POST /ask
            └─ LM Studio OpenAI互換API (既定127.0.0.1:5858)
```

| endpoint | upstream | 用途 |
|----------|----------|------|
| `GET /health` | 不要 | processの生存確認 |
| `GET /fixed` | 不要 | 固定JSONとresponse headerの確認 |
| `POST /ask` | 必要 | JSON bodyを検証してlocal LLMへ中継 |
| `GET /ask?prompt=...` | 必要 | 既定では無効。URLへpromptを残す危険を比較する場合だけ明示的に有効化 |

## 起動

PowerShellで必要な値を設定して起動する。`LMSTUDIO_MODEL`にはLM Studioに表示されたmodel IDを指定する。

```powershell
$env:LMSTUDIO_BASE_URL = "http://127.0.0.1:5858"
$env:LMSTUDIO_MODEL = "loaded-model-id"
python -X utf8 src\simple_web_api.py
```

LM Studioが停止していても `/health` と `/fixed` は確認できる。

## 正常系のcurl例

別のPowerShellから実行する。

```powershell
curl.exe -i http://127.0.0.1:9898/health
curl.exe -i http://127.0.0.1:9898/fixed
curl.exe -i -X POST http://127.0.0.1:9898/ask -H "Content-Type: application/json" --data-raw '{"prompt":"HTTPを3行で説明してください"}'
```

期待結果:

- `/health`: `200` と `{"status":"ok"}`
- `/fixed`: `200` と固定message
- `POST /ask`: `200` と `answer`。生成時間はlocal modelに依存する

## 失敗系のcurl例

```powershell
# promptなし
curl.exe -i -X POST http://127.0.0.1:9898/ask -H "Content-Type: application/json" --data-raw '{}'

# JSON構文エラー
curl.exe -i -X POST http://127.0.0.1:9898/ask -H "Content-Type: application/json" --data-raw '{bad json}'

# Content-Type違反
curl.exe -i -X POST http://127.0.0.1:9898/ask -H "Content-Type: text/plain" --data-raw 'hello'

# query stringへpromptを置く旧形式は既定で無効
curl.exe -i "http://127.0.0.1:9898/ask?prompt=secret"

# 存在しないroute
curl.exe -i http://127.0.0.1:9898/unknown
```

| 条件 | status | error |
|------|--------|-------|
| promptなし | `400` | `prompt_required` |
| JSON構文エラー | `400` | `invalid_json` |
| JSON object以外 | `400` | `json_object_required` |
| request上限超過 | `413` | `request_too_large` |
| prompt上限超過 | `413` | `prompt_too_large` |
| Content-Type違反 | `415` | `content_type_must_be_application_json` |
| GET `/ask` | `405` | `get_ask_disabled` |
| upstream停止 | `502` | `upstream_unavailable` |

外部へ返すerrorは固定し、内部URLや例外detailをresponseへ含めない。

## 設定

| 環境変数 | 既定値 | 説明 |
|----------|--------|------|
| `WEB_API_HOST` | `127.0.0.1` | bind先。loopback以外は既定で拒否 |
| `WEB_API_PORT` | `9898` | listen port |
| `WEB_API_MAX_REQUEST_BYTES` | `16384` | JSON body上限 |
| `WEB_API_MAX_PROMPT_CHARS` | `4000` | prompt文字数上限 |
| `WEB_API_CORS_ORIGIN` | 空 | 空ならCORS headerを返さない。指定時も完全一致originだけ |
| `WEB_API_ALLOW_GET_ASK` | `false` | URL query版 `/ask` を明示的に有効化 |
| `WEB_API_ALLOW_REMOTE_BIND` | `false` | loopback以外へbindする危険なoverride |
| `LMSTUDIO_BASE_URL` | `http://127.0.0.1:5858` | local LLM server |
| `LMSTUDIO_MODEL` | `local-model` | loaded model ID |
| `LMSTUDIO_TIMEOUT_SECONDS` | `120` | upstream timeout |
| `WEB_API_MAX_UPSTREAM_RESPONSE_BYTES` | `1048576` | upstream response上限 |
| `WEB_API_ALLOW_REMOTE_UPSTREAM` | `false` | loopback以外のupstreamを許可するoverride |

## セキュリティ上の制約

- 認証、認可、rate limit、TLS、永続audit logを持たないため、外部公開しない。
- loopback bindとlocal upstreamを既定とする。remote許可flagは隔離された演習環境以外で使わない。
- promptをURL、server log、error responseへ含めない。通常は `POST /ask` を使う。
- CORS `*`を返さず、必要なoriginだけを明示する。
- request、prompt、upstream responseへ上限を設ける。
- API key、個人情報、社内秘密を教材requestへ入れない。

## 完了条件

- `200 / 400 / 404 / 405 / 413 / 415 / 502` の使い分けを説明できる。
- client validationとupstream failureを分けて説明できる。
- GET queryではなくPOST JSONを使う理由を説明できる。
- loopback、CORS、size limit、固定errorが軽減するriskを説明できる。
