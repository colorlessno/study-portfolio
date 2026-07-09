# web21_network_debug

DevTools Network タブで成功/失敗APIを確認するサンプルです。

## 起動

```bash
docker compose up --build
```

## URL

- Frontend: `http://localhost:5181`
- API: `http://localhost:13021/debug/success`

## 確認ポイント

- 200 / 400 / 404 / 500 のStatus
- Request URL
- Response body
- API停止時のnetwork error
