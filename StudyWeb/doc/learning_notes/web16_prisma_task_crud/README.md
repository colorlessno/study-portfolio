# web16_prisma_task_crud

NestJS + Prisma + PostgreSQL で Task CRUD を行うサンプルです。Prisma migration は Docker コンテナ内で実行します。

## 起動

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up -d backend
```

## 確認

```bash
curl -X POST http://localhost:13016/tasks -H "Content-Type: application/json" -d "{\"title\":\"Prisma CRUD\"}"
curl http://localhost:13016/tasks
```

## ポイント

- PostgreSQL は Docker の `db` サービス
- Prisma CLI は `migrate` サービス内で実行
- backend コンテナに Node.js / npm / Prisma CLI が入る
