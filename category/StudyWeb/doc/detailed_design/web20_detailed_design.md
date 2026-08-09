# web20 詳細設計## 画面からPOSTしてDB保存
---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web20_create_task_form/backend/ and src/frontend/src/studyweb/systems/web20_create_task_form/frontend/ and src/infra/compose/web20_create_task_form/
├── docker-compose.yml
├── frontend/
├── backend/
│  ├── prisma/
│  └── src/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| TaskForm | 入力| title state, submit |
| TaskList | 表示 | tasks表示 |
| TasksController | API | GET/POST |
| TasksService | DB操作| findMany/create |
| PrismaService | ORM | DB接続|

## 3. API 詳細

| メソッド| パス | 処理|
|---|---|---|
| GET | `/tasks` | 一覧取得|
| POST | `/tasks` | 成 |

## 4. 詳細API I/O 定義

### POST `/tasks`

| 項目| 型| 必須|
|---|---|---|
| `title` | string | ○|

### Taskレスポンス

| 項目| 型|
|---|---|
| `id` | string |
| `title` | string |
| `done` | boolean |
| `createdAt` | string |

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| title(front) | 空不可 | 送信しない|
| title(api) | 空不可 | 400 |
| DB | migration済み | 起動手順確認|

## 6. エラー応答仕様
| error_code | HTTP/状態| 発生条件 |
|---|---|---|
| `validation_failed` | 400 | 空title |
| `database_error` | 500 | DB保存失敗|
| `network_error` | client | API未到達|

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| Frontend | trim後空文字チェック|
| Backend | DTO validation |
| DB | title NOT NULL |

## 8. データベース詳細

| カラム | 型| 備考|
|---|---|---|
| id | String | PK |
| title | String | 必須|
| done | Boolean | default false |
| createdAt | DateTime | default now |
| updatedAt | DateTime | updatedAt |

## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- APIエラーは画面に表示する
- DB保存確認の一覧再取得で行う
- 監査ログは扱わない
## 11. DDL

```prisma
model Task {
  id        String   @id @default(cuid())
  title     String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 12. 実装メモ

- 保存の功後のフォームを空にする
- 一覧更新は再取得または成結果をstateへ追加する

