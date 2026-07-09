# web14 詳細設計## NestJS POST API

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web14_nest_post_api/
├── package.json
├── src/
│  ├── main.ts
│  ├── app.module.ts
│  └── tasks/
│      ├── tasks.module.ts
│      ├── tasks.controller.ts
│      ├── tasks.service.ts
│      └── dto/
│          └── create-task.dto.ts
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| TasksController | POST受付| `create()` |
| TasksService | タスク風レスポンス成 | `create()` |
| CreateTaskDto | 入力定義 | `title`, `description` |
| ValidationPipe | 入力検証 | DTO検証 |

## 3. API 詳細

### 3.1 POST `/tasks`

- 入力 JSON body
- 検証: title必要、最大文字数
- 応答 成済みTask風JSON

## 4. 詳細API I/O 定義

### 4.1 リクエスト
| 項目| 型| 必須| 制約|
|---|---|---|---|
| `title` | string | ○| 1。0文列|
| `description` | string |  | 200文字以内|

### 4.2 レスポンス

| 項目| 型| 説明|
|---|---|---|
| `id` | string | 生成ID |
| `title` | string | 入力値 |
| `description` | string | 入力値 |
| `createdAt` | string | ISO日時|

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| title | 必須| 400 |
| title | 最大80文列| 400 |
| description | 最大200文列| 400 |

## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `validation_failed` | 400 | DTO検証エラー |
| `invalid_json` | 400 | JSON不正 |

## 7. バリデーション一覧

| DTO項目| decorator例|
|---|---|
| title | `@IsString()`, `@IsNotEmpty()`, `@MaxLength(80)` |
| description | `@IsOptional()`, `@IsString()`, `@MaxLength(200)` |

## 8. データベース詳細

DBは使用しないレスポンスはServiceで生成する。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- 正常系と異常系のcurl例をREADMEに記載する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `main.ts` で `ValidationPipe` を有効化する
- `Content-Type: application/json` で確認する
