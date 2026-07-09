# security02 JWT認証

HMAC署名付きJWTの発行と検証をNode標準機能だけで確認します。

## 実行

```powershell
npm run start
```

`POST /token`でトークンを発行し、`Authorization: Bearer <token>`付きで`GET /profile`を呼びます。署名鍵は学習用ダミー値です。
