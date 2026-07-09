# web17_relation_user_task

Prismaで User と Task の 1対多リレーションを扱うサンプルです。

## 起動

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up -d backend
```

## 確認

```bash
curl -X POST http://localhost:13017/users -H "Content-Type: application/json" -d "{\"name\":\"Learner\",\"email\":\"learner@example.com\"}"
curl http://localhost:13017/users
```

取得した `id` を使って:

```bash
curl -X POST http://localhost:13017/tasks -H "Content-Type: application/json" -d "{\"title\":\"relation確認\",\"userId\":\"USER_ID\"}"
curl http://localhost:13017/tasks
```
