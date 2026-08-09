# web17 詳細設計## User と Task のリレーション

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web17_relation_user_task/
├── docker-compose.yml
├── package.json
├── prisma/
│  └── schema.prisma
├── src/
│  ├── prisma.service.ts
│  ├── users/
│  └── tasks/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| UsersController | User API | `create`, `findAll`, `findOne` |
| UsersService | User操作| `prisma.user.*` |
| TasksController | Task API | `create`, `findAll` |
| TasksService | User紐づきTask操作| User存在確認、Task成 |

## 3. API 詳細

| メソッド| パス | 処理|
|---|---|---|
| POST | `/users` | User成 |
| GET | `/users` | User一覧 |
| GET | `/users/:id` | User詳細 + tasks |
| POST | `/tasks` | User持つTask成 |
| GET | `/tasks` | Task一覧 + user |

## 4. 詳細API I/O 定義

| API | リクエスト|
|---|---|
| POST `/users` | `name`, `email` |
| POST `/tasks` | `title`, `userId` |

| レスポンス | 内容|
|---|---|
| User詳細 | User + `tasks[]` |
| Task一覧 | Task + `user` |

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| email | 空不可。複数可 | 400 |
| userId | 存在必須| 404 |
| task.title | 空不可 | 400 |

## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `user_not_found` | 404 | Userない|
| `email_duplicated` | 400 | email重複|
| `validation_failed` | 400 | DTO不正 |

## 7. バリデーション一覧

| DTO | ルール |
|---|---|
| CreateUserDto | name/email必須|
| CreateTaskDto | title/userId必須|

## 8. データベース詳細

| テーブル | リレーション |
|---|---|
| User | 1:N Task |
| Task | N:1 User |

## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- 外部キー制約反をAPIエラーに変換する
- relation確認手順READMEに記載する
## 11. DDL

```prisma
model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
  tasks Task[]
}

model Task {
  id     String @id @default(cuid())
  title  String
  done   Boolean @default(false)
  userId String
  user   User @relation(fields: [userId], references: [id])
}
```

## 12. 実装メモ

- `include: { tasks: true }` と `include: { user: true }` を確認対象にする
- 認証ユーザーではなくリレーション学習用のUserとして扱い
