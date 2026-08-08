# devops08 詳細設計

## Docker logs調査

## 1. 実装配置

```text
StudyDevOps/src/apps/devops08_docker_logs_investigation/
  app/package.json
  app/package-lock.json
  app/server.js
  tests/investigation.test.js
  docker-compose.yml
  docs/investigation_template.md
```

## 2. compose service

| service | 用途 |
|---|---|
| `app-ok` | 正常起動 |
| `app-missing-env` | env不足で失敗 |
| `app-runtime-error` | 起動後にruntime error |

## 3. 調査コマンド

```powershell
docker compose ps
docker compose logs app-missing-env
docker compose logs --tail 50 app-runtime-error
docker compose exec app-ok env
```

## 4. failure pattern

| pattern | 原因 | 見る場所 |
|---|---|---|
| env missing | 必須環境変数なし | container logs |
| port conflict | host port 使用中 | compose ps / bind error |
| runtime error | 起動後例外 | app logs |

構造化ログは`timestamp`、`level`、`action`、`error_code`、`request_id`を必要に応じて持つ。URLはpathnameだけを記録する。

## 5. 調査テンプレート

| 項目 | 内容 |
|---|---|
| 発生日時 | いつ起きたか |
| service | 対象service |
| status | ps の状態 |
| logs | 重要ログ |
| cause | 推定原因 |
| action | 対処 |

## 6. 安全性

- secrets を logs と調査メモに残さない。
- 破壊的な Docker 操作を前提にしない。
- テキストファイルは UTF-8 BOMなしで保存する。

## 7. CI連携

CIではNode.js testがmissing env、runtime error、正常応答のシグナルを検証する。Docker調査は手動演習とし、将来Compose自体が失敗した場合は`docker compose ps -a`と対象serviceのlogsをjob logへ残す。

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops08_docker_logs_investigation/app test
```
