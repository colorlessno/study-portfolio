# web15_api_error_patterns

200 / 400 / 404 / 500 のAPIレスポンスを確認するNestJSサンプルです。

## 起動方法

```bash
npm install
npm run start:dev
```

## 確認コマンド

```bash
curl -i http://localhost:3000/status/ok
curl -i http://localhost:3000/status/bad-request
curl -i http://localhost:3000/status/not-found
curl -i http://localhost:3000/status/server-error
```
