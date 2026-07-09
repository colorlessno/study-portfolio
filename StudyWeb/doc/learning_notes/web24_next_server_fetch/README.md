# web24_next_server_fetch

Next.js Server Component でデータを取得して表示するサンプルです。

## 起動方法

```bash
npm install
npm run dev
```

## 確認ポイント

- `app/tasks/page.tsx` が async Server Component
- 初期表示時点で一覧が描画される
- `useEffect` のクライアントfetchは使っていない
