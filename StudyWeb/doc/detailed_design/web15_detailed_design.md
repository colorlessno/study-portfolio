# web15 詳細設計## APIエラーパターン確認
---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web15_api_error_patterns/
├── package.json
├── src/
│  ├── main.ts
│  ├── app.module.ts
│  └── errors/
│      ├── errors.module.ts
│      ├── errors.controller.ts
│      └── errors.service.ts
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| ErrorsController | スステータス別API | `ok()`, `badRequest()`, `notFound()`, `serverError()` |
| ErrorsService | 固定レスポンス成 | `buildOk()` |
| README | 確認手順| curl例|

## 3. API 詳細

| メソッド| パス | HTTP | 役割 |
|---|---|---|---|
| GET | `/status/ok` | 200 | 正常 |
| GET | `/status/bad-request` | 400 | リクエスト不正 |
| GET | `/status/not-found` | 404 | 未検出 |
| GET | `/status/server-error` | 500 | サーバーエラー |

## 4. 詳細API I/O 定義

### 4.1 正常レスポンス

| 項目| 型|
|---|---|
| `message` | string |
| `statusCode` | number |

### 4.2 エラーレスポンス

| 項目| 型|
|---|---|
| `statusCode` | number |
| `message` | string |
| `error` | string |

## 5. 入力チェック仕様
入力値はないパスごとの固定スステータスを確認する。
## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `bad_request_sample` | 400 | `/status/bad-request` |
| `not_found_sample` | 404 | `/status/not-found` |
| `server_error_sample` | 500 | `/status/server-error` |

## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| HTTP status | パスごとに期得と一致 |
| response body | JSON形式|

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- curl の `-i` でステータスを確認する
- 500 は学習用の固定の再現であり本番では公開しない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- NestJS の `BadRequestException`, `NotFoundException`, `InternalServerErrorException` を使う
- README に期待ステータス表を記載する
