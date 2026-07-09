# web48 job status API 詳細設計
## 0. 関連文書

- `../requirements/web48_job_status_api_requirements.md`
- `../basic_design/web48_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web48_job_status_api/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web48_job_status_api/
  README.md
  docs/job_state.md
  docs/polling_flow.md
```

## 2. 主要設計
| API | 内容|
|---|---|
| `POST /jobs` | job受付|
| `GET /jobs/:id` | 状態確認|

| Status | 意味 |
|---|---|
| queued | 受付済み |
| running | 実行中 |
| succeeded | 成功 |
| failed | 失敗|

## 3. 確認手順
1. jobを成する
2. job idを受け取る3. pollingで状態を見る
4. 成功・失敗を確認する
## 4. 完了条件

- 受付と状態確認が列れてい
- job状態遷移を確認できる
- 失敗理由を表示できる

