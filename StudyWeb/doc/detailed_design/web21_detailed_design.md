# web21 詳細設計## DevToolsで通信確認
---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web21_network_debug/backend/ and src/frontend/src/studyweb/systems/web21_network_debug/frontend/ and src/infra/compose/web21_network_debug/
├── docker-compose.yml
├── frontend/
└── backend/
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| DebugPanel | API操作UI | 成功/失敗ボタン |
| Debug API | スステータス返却 | 200/400/404/500 |
| README | 列列手順| Network確認|

## 3. API 詳細

| メソッド| パス | HTTP |
|---|---|---|
| GET | `/debug/success` | 200 |
| GET | `/debug/bad-request` | 400 |
| GET | `/debug/not-found` | 404 |
| GET | `/debug/server-error` | 500 |

## 4. 詳細API I/O 定義

| レスポンス | 型| 内容|
|---|---|---|
| `statusCode` | number | HTTPスステータス |
| `message` | string | 説明|
| `details` | object | 任意補足 |

## 5. 入力チェック仕様
入力値はないURLとHTTPスステータスを確認する。
## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `bad_request_sample` | 400 | bad-request API |
| `not_found_sample` | 404 | not-found API |
| `server_error_sample` | 500 | server-error API |
| `network_error` | client | API停止/URL誤る|

## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| 画面表示 | statusとbodyを表示 |
| Network | Request URL/Status/Responseを確認|
| error state | API失敗時に表示 |

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- DevTools Network を主要確認手段にする
- APIログとブラウザエラーを分けて確認する
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- README に「フロントが悪い・APIが悪い・DBが悪い」の切り分け観点を書く
- CORSエラーと404の違いを説明する
