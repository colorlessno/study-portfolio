# web22_tanstack_query

TanStack Query の `useQuery` でAPIデータを取得するサンプルです。

## 起動

```bash
docker compose up --build
```

## URL

- Frontend: `http://localhost:5182`
- API: `http://localhost:13022/tasks`

## 確認ポイント

- `QueryClientProvider` でアプリを包む
- `useQuery` で loading / error / data を扱う
- 再取得ボタンで `refetch` を確認する
