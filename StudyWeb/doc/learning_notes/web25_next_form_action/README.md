# web25_next_form_action

Next.js Server Actions でフォーム送信を扱うサンプルです。

## 起動方法

```bash
npm install
npm run dev
```

## 確認ポイント

- `app/actions.ts` に `"use server"` がある
- フォームの `action` に Server Action を渡している
- React + NestJS の分離構成ではなく、Next.js内で送信処理を扱う
