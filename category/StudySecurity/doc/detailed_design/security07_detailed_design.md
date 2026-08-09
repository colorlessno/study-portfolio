# security07 CSRF対策 詳細設計
## 0. 関連文書

- `../requirements/security07_csrf_requirements.md`
- `../basic_design/security07_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studysecurity/systems/security07_csrf/
  README.md
  Dockerfile
  package.json
  app/server.js
  public/index.html
  docs/csrf_flow.md
```

## 2. 主要設計
| 要素 | 内容 |
|---|---|
| `GET /` | `/form`へredirectする |
| `GET /form` | 5分期限の一回限りtokenを発行し、`sid=demo` Cookieとフォームへ設定する |
| `POST /transfer` | Cookieの`sid`とフォームtokenを照合する |
| 失敗応答 | Cookie欠落は401、token欠落・不一致・期限切れ・再利用は403にする |
| 状態変更 | ダミー残高やカウンタ更新だけに限定する |

## 3. 安全制約
- 実送金、実注文、外部送信は行わない。
- CSRF例はローカルフォームとダミー状態変更に限定する。
- SameSiteだけで完全防御とは説明しない。
## 4. 確認手順
1. Cookieなし送信が401になることを確認する。
2. Cookieあり・tokenなし送信が403になることを確認する。
3. Cookieと正しいtokenを組み合わせた送信が200になることを確認する。
4. 同じtokenの再送が403になることを確認する。
5. Cookie属性とtoken検証の役割分担を読む。
## 5. 完了条件

- CSRFの成立条件を説明できる。
- トークン検証の流れを説明できる。
- Cookie属性との役割分担を説明できる。
