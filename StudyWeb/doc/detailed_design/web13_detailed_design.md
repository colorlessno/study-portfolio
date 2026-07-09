# web13 詳細設計## NestJS Hello API

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web13_nest_hello_api/
├── package.json
├── src/
│  ├── main.ts
│  ├── app.module.ts
│  ├── app.controller.ts
│  └── app.service.ts
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| `main.ts` | アプリ起動| `bootstrap()` |
| `AppModule` | ルートモジュール | module定義 |
| `AppController` | GET API受付| `getHello()` |
| `AppService` | レスポンス成 | `getHello()` |

## 3. API 詳細

### 3.1 GET `/hello`

- 入力 なし
- 処理 Service からメッセージオブジェクトを取得
- 応答 JSON

## 4. 詳細API I/O 定義

### 4.1 レスポンス

| 項目| 型| 説明|
|---|---|---|
| `message` | string | Helloメテージ |
| `sample` | string | `web13_nest_hello_api` |
| `timestamp` | string | ISO日時|

## 5. 入力チェック仕様
入力値はないリクエストメソッドとパスのみ確認対象。
## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `not_found` | 404 | 定義されていないパス |
| `method_not_allowed` | 405相当| 想定外メソッド|

NestJS標準エラー形式を基本とする。
## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| レスポンス | JSONオブジェクテ|
| timestamp | ISO文列 |

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- 起動ログでポートを確認する
- curlでHTTPステータスを確認する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `npm run start:dev` で起動する
- README に `curl http://localhost:3000/hello` を記載する
