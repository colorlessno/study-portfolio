# web18_seed_and_migration

Prisma migration と seed を Docker コンテナ内で実行するサンプルです。

## 実行

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose run --rm seed
```

## 確認

Prisma Studio を使う場合:

```bash
docker compose run --rm --service-ports seed npx prisma studio
```

## ポイント

- migration は `migrate` サービスで実行
- seed は `seed` サービスで実行
- 初期データは2件以上投入する
