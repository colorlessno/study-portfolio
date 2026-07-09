# web20_create_task_form

## 概要
ReactのフォームからNestJS APIへタスクを登録し、PostgreSQLに保存するサンプルです。
## 使用技行
- フロントエンテ React / Vite / TypeScript
- バックエンテ NestJS / Prisma
- DB: PostgreSQL
- そ付 Docker Compose

## 起動方法
```bash
docker compose up --build
docker compose run --rm migrate
```

## 確認方法
- 画面: `http://localhost:5180`
- API: `http://localhost:13020/tasks`
- DB: タスク作成後に一覧へ反映されることを確認
- DevTools / Network: `POST /tasks` のステータスとレスポンスを確認
## ファイル成

```text
src/backend/src/studyweb/systems/web20_create_task_form/backend/ and src/frontend/src/studyweb/systems/web20_create_task_form/frontend/ and src/infra/compose/web20_create_task_form/
  frontend/
  backend/
  prisma/
  docker-compose.yml
  README.md
```

## 学習ポイント
- フォーム入力値をstateで管理する
- APIへPOSTして保存する
- migrationとDB永続化の流れを見る

## 詰まった点

| 問題| 原因 | 対処|
|---|---|---|
| CORSエラー | API側の許可設定不足 | NestJSでCORSを有効化|

## 改善の
- 入力チェックを増やす
- 削除機能を追加する

## 注意
実際のDBパスワードやAPIキーはREADMEに書きません。
