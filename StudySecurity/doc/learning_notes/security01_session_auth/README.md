# security01 セッション認証

ローカルメモリのセッションと`HttpOnly` Cookieを使い、ログイン、本人確認、ログアウトを確認する学習サンプルです。

## 実行

```powershell
npm run start
```

## 確認

- `GET /me`は未ログイン時に401を返す。
- `POST /login`は`sid` Cookieを返す。
- Cookie付き`GET /me`はログインユーザーを返す。
- `POST /logout`後は再度401になる。

実ユーザー、実パスワード、実秘密情報は扱いません。
