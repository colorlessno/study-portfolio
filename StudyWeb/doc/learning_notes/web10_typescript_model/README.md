# web10_typescript_model

User / Task / Article の型を定義し、React画面で型安全に表示するサンプルです。

## 起動方法

```bash
npm install
npm run dev
```

## 確認ポイント

- `models/` に型定義を分けている
- `data/sampleData.ts` に型付きサンプルデータがある
- props に `User`、`Task[]`、`Article[]` の型を付けている
- `any` を使っていない
