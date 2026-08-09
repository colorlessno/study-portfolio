# web34 CORS成功・失敗サンプル 詳細設計
## 0. 関連文書

- `../requirements/web34_cors_success_failure_requirements.md`
- `../basic_design/web34_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web34_cors_success_failure/
  Dockerfile
  package.json
  backend/src/server.js
  frontend/src/server.js
doc/learning_notes/web34_cors_success_failure/
  README.md
  docs/cors_failure.md
  docs/cors_success.md
```

## 2. 主要設計
| 区列| 内容|
|---|---|
| Frontend | `http://localhost:5173` 相当|
| Backend | `http://localhost:3000` 相当|
| Mode | CORS拒否 / CORS許可を環境変数で切替 |
| API | `GET /api/message`, `POST /api/message` |

## 3. 確認手順
1. CORS拒否モードでブラウザ通信する
2. Console/Networkのエラーを記録する
3. 許可モードに列替える
4. 通信成功を確認する5. curlでは制約異なることを確認する
## 4. 完了条件

- CORS失敗と成功を再現できる
- preflightを確認できる
- ブラウザ制約サーバ設定の関係を説明できる

