# web16 詳細設計## Prisma Task CRUD

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web16_prisma_task_crud/
├── docker-compose.yml
├── package.json
├── .env.example
├── prisma/
│  └── schema.prisma
├── src/
│  ├── main.ts
│  ├── app.module.ts
│  ├── prisma.service.ts
│  └── tasks/
│      ├── tasks.controller.ts
│      ├── tasks.service.ts
│      └── dto/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| TasksController | CRUD API | `create`, `findAll`, `findOne`, `update`, `remove` |
| TasksService | Prisma操作| `prisma.task.*` |
| PrismaService | PrismaClient提例| 接続管理|
| schema.prisma | DBモデル| `Task` |

## 3. API 詳細

| メソッド| パス | 処理|
|---|---|---|
| POST | `/tasks` | 成 |
| GET | `/tasks` | 一覧 |
| GET | `/tasks/:id` | 詳細 |
| PATCH | `/tasks/:id` | 更新 |
| DELETE | `/tasks/:id` | 削除 |

## 4. 詳細API I/O 定義

### 4.1 Task

| 項目| 型| 必須|
|---|---|---|
| `id` | string | response |
| `title` | string | ○|
| `done` | boolean |  |
| `createdAt` | string | response |
| `updatedAt` | string | response |

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| title | 空不可 | 400 |
| id | UUIDまたはcuid形式| 400/404 |
| done | boolean | 400 |

## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `task_not_found` | 404 | 対象IDない|
| `validation_failed` | 400 | DTO不正 |
| `database_error` | 500 | DB接続クエリ失敗|

## 7. バリデーション一覧

| DTO | ルール |
|---|---|
| CreateTaskDto | title必須|
| UpdateTaskDto | title/done任意、型チェック|

## 8. データベース詳細

### 8.1 `Task`

| カラム | 型| 備考|
|---|---|---|
| `id` | String | PK |
| `title` | String | 必須|
| `done` | Boolean | default false |
| `createdAt` | DateTime | default now |
| `updatedAt` | DateTime | auto update |

## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- DBエラーはAPIログで確認する
- 削除や更新の監査ログは扱わない
- README に migration と CRUD確認項目を記載する
## 11. DDL

Prisma schema 例

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

- PostgreSQL は Docker Compose で起動する
- `.env` の `DATABASE_URL` を Prisma が参照する
- `prisma migrate dev` を実行してからAPI確認する
