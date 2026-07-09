# web20_create_task_form

ReactフォームからNestJS APIへPOSTし、Prisma + PostgreSQL に保存するサンプルです。

## 起動

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up --build
```

## URL

- Frontend: `http://localhost:5180`
- API: `http://localhost:13020/tasks`

## 確認ポイント

- 空タイトルはフロントで送信しない
- API側でもDTOで必須チェックする
- 保存後に一覧が更新される
- PostgreSQLはDockerコンテナで動く
