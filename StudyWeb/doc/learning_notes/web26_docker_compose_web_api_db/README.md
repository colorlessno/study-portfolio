# web26_docker_compose_web_api_db

Docker Composeで Web / API / DB をまとめて起動するサンプルです。

## 構成

- `web`: Vite + React の画面
- `api`: NestJS API
- `db`: PostgreSQL
- `db/init.sql`: `tasks` テーブル作成と初期データ投入

## 起動

必要に応じて `.env.example` を `.env` にコピーし、ポートや接続先を変更します。

```bash
docker compose up --build
```

## URL

- Web: `http://localhost:5186`
- API health: `http://localhost:13026/health`
- API tasks: `http://localhost:13026/tasks`

## 運用コマンド

```bash
docker compose ps
docker compose logs api
docker compose logs db
docker compose down
```

DB起動直後にAPI接続で失敗した場合は、`docker compose logs api` で確認し、`docker compose restart api` を実行します。ポート競合時は `.env` の `WEB_PORT`、`API_PORT`、`DB_PORT` を変更します。
