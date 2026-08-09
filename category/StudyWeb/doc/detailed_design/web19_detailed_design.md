# web19 詳細設計## ReactからAPIを呼んで一覧表示

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web19_fetch_task_list/backend/ and src/frontend/src/studyweb/systems/web19_fetch_task_list/frontend/ and src/infra/compose/web19_fetch_task_list/
├── docker-compose.yml
├── frontend/
│  └── src/
└── backend/
    └── src/
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| Frontend App | 一覧表示 | `fetchTasks`, loading/error/data |
| Tasks API | データ提例| `GET /tasks` |
| Docker Compose | 起動| frontend/backend |

## 3. API 詳細

### GET `/tasks`

- 入力 なし
- 応答 Task配列

## 4. 詳細API I/O 定義

| レスポンス項目| 型| 説明|
|---|---|---|
| `id` | string | ID |
| `title` | string | タイトル |
| `done` | boolean | 完了態|

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| API URL | 環境変数で定義 |
| response | 配列であること |
| Task | `id/title/done` を持つ |

## 6. エラー応答仕様
| error_code | HTTP/状態| 発生条件 |
|---|---|---|
| `api_unreachable` | network error | API停止/URL誤る|
| `tasks_fetch_failed` | 500 | API内容エラー |
| `invalid_response` | client error | 想定外JSON |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| loading | fetchのtrue |
| error | catch時に設定|
| tasks | 成功時にstate保存|

## 8. データベース詳細

DBは必要にしないPI内容定型列を返す。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- DevTools Network でリクエストを確認する
- API停止時の画面表示を確認する
## 11. DDL

DBを使用しない各DDL はない
## 12. 実装メモ

- CORSを有効化する
- README に API URL 設定とエラー確認手順を書く
