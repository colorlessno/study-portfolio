# web14_nest_post_api

NestJSで `POST /tasks` を受け取り、DTOバリデーションを行うサンプルです。

## 起動方法

```bash
npm install
npm run start:dev
```

## 正常系

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"NestJSを学ぶ\",\"description\":\"POST API確認\"}"
```

## 異常系

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"\"}"
```
