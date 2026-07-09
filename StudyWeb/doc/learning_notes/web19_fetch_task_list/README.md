# web19_fetch_task_list

ReactからNestJS APIを `fetch` で呼び、タスク一覧を表示します。

## 起動

```bash
docker compose up --build
```

## URL

- Frontend: `http://localhost:5179`
- API: `http://localhost:13019/tasks`

## 確認ポイント

- loading / error / success の状態表示
- DevTools Network に `GET /tasks` が出る
- CORSが有効になっている
