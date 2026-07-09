# devops05 詳細設計

## DB付きCI

## 1. 実装配置

```text
src/apps/devops05_db_ci/
  README.md
  app/package.json
  app/src/db.js
  db/schema.sql
  db/seed.sql
  tests/db.test.js
  docker-compose.yml
```

## 2. DB設計

| table | column |
|---|---|
| `tasks` | `id`, `title`, `status`, `created_at` |

## 3. 初期化フロー

```text
postgres start -> healthcheck -> schema.sql -> seed.sql -> tests/db.test.js
```

## 4. test case

| case | 確認 |
|---|---|
| connection | DBへ接続できる |
| seed | seed task が取得できる |
| insert | test task を追加できる |
| cleanup | test data を削除できる |

## 5. compose設計

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
  test:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

## 6. 検証コマンド

```powershell
docker compose -f .\src\apps\devops05_db_ci\docker-compose.yml up --build --abort-on-container-exit
docker compose -f .\src\apps\devops05_db_ci\docker-compose.yml logs db
```

## 7. 安全性

- secrets は使わず、DB接続値は教材用固定値にする。
- 本番DBや個人情報を使わない。
- テキストファイルは UTF-8 BOMなしで保存する。
