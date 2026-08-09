# devops07 詳細設計

## health check endpoint

## 1. 実装配置

```text
category/StudyDevOps/src/apps/devops07_health_check_endpoint/
  app/package.json
  app/package-lock.json
  app/server.js
  tests/health.test.js
  docker-compose.yml
```

## 2. endpoint設計

| method | path | 用途 | response |
|---|---|---|---|
| GET | `/health` | process alive | `{ "status": "ok" }` |
| GET | `/ready` | dependency ready | `{ "status": "ready", "dependencies": {} }` |
| POST | `/toggle-dependency` | failure疑似切替 | `{ "dependency_ok": false }` |

## 3. response schema

```json
{
  "status": "ok",
  "dependencies": {
    "sample_dependency": "ok"
  }
}
```

## 4. Docker healthcheck

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
  interval: 10s
  timeout: 3s
  retries: 5
```

## 5. test case

| case | 確認 |
|---|---|
| health ok | 200 / `status=ok` |
| ready ok | 200 / dependency ok |
| ready failure | 503 / dependency failed |

testは専用portでserverを起動し、最大3秒以内にhealthへ接続できなければ失敗する。正常、依存障害、health継続、ready復旧を確認後、processを停止する。

## 6. 検証コマンド

```powershell
npm.cmd --prefix category/StudyDevOps/src/apps/devops07_health_check_endpoint/app test
docker compose -f category/StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml up -d --build
docker compose -f category/StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml ps
docker compose -f category/StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml down
```

## 7. 安全性

- secrets は health / ready response に出さない。
- 内部接続文字列やtokenを返さない。
- `toggle-dependency`は教材専用の障害注入であり、本番公開しない。
- テキストファイルは UTF-8 BOMなしで保存する。
