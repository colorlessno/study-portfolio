# web33 Cookie / Session 最小サンプル 詳細設計
## 0. 関連文書

- `../requirements/web33_cookie_session_requirements.md`
- `../basic_design/web33_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web33_cookie_session/
  Dockerfile
  package.json
  server/src/server.js
doc/learning_notes/web33_cookie_session/
  README.md
  docs/cookie_check.md
  docs/session_flow.md
```

## 2. 主要設計
| 区列| 内容|
|---|---|
| API | `POST /login`, `POST /logout`, `GET /me` |
| Cookie | `sid`, `HttpOnly`, `SameSite=Lax` |
| Session | 学習用メモリsession |
| Client | serverがある信する学習用HTMLでlogin/logout/meを確認|

## 3. 確認手順
1. 未ログインで `/me` を確認する2. loginしてCookieを確認する3. `/me` がログイン済みになることを確認する4. logout後にCookie/sessionが無効になることを確認する
## 4. 完了条件

- CookieとSessionの役割を確認できる
- login前後の差列説明できる
- Cookieに機密情報を直接入れていないか
