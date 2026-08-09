# devops08 Docker logs調査

目安: 25〜45分。正常、起動失敗、runtime errorの3serviceを比較し、statusと構造化ログから原因を分類します。

## このテーマでできるようになること

- 起動前の設定不足と、起動後のrequest失敗を区別する。
- `compose ps -a`、`logs`、HTTP responseを事実として集める。
- evidence、仮説、対応を混ぜずに調査メモへ残す。

## 成果物

- [要件定義](../../requirements/devops08_docker_logs_investigation_requirements.md)
- [基本設計](../../basic_design/devops08_basic_design.md)
- [詳細設計](../../detailed_design/devops08_detailed_design.md)
- [障害再現server](../../../src/apps/devops08_docker_logs_investigation/app/server.js)
- [シグナル自動テスト](../../../src/apps/devops08_docker_logs_investigation/tests/investigation.test.js)
- [Docker Compose](../../../src/apps/devops08_docker_logs_investigation/docker-compose.yml)
- [調査メモ](../../../src/apps/devops08_docker_logs_investigation/docs/investigation_template.md)

## 始める前に予想する

1. `app-missing-env`と`app-runtime-error`は`ps -a`でどう違って見えるか。
2. 原因を推測する前に保存すべき事実は何か。

## 15分で再開する

まずDockerなしで、3つの障害シグナルが再現できることを確認します。

```powershell
npm.cmd --prefix category/StudyDevOps/src/apps/devops08_docker_logs_investigation/app ci
npm.cmd --prefix category/StudyDevOps/src/apps/devops08_docker_logs_investigation/app test
```

Docker調査は次の一巡だけを実施し、常時監視しません。

```powershell
docker compose -f category/StudyDevOps/src/apps/devops08_docker_logs_investigation/docker-compose.yml up -d --build
docker compose -f category/StudyDevOps/src/apps/devops08_docker_logs_investigation/docker-compose.yml ps -a
docker compose -f category/StudyDevOps/src/apps/devops08_docker_logs_investigation/docker-compose.yml logs app-missing-env
curl.exe -i -H "X-Request-Id: req-investigation-01" http://localhost:18089/work
docker compose -f category/StudyDevOps/src/apps/devops08_docker_logs_investigation/docker-compose.yml logs app-runtime-error
docker compose -f category/StudyDevOps/src/apps/devops08_docker_logs_investigation/docker-compose.yml down
```

## 読む順番と観察点

1. Composeで各serviceの`APP_MODE`を比較する。
2. serverでstartup failureとrequest failureのlog fieldsを比較する。
3. `ps -a`のstatusとexit codeを記録する。
4. logsの`action`、`error_code`、`request_id`をresponseと対応付ける。
5. 調査テンプレートへ事実と仮説を分けて書く。

## 安全に壊して直す

port conflictは、使用中のportを無理に停止せず、Composeのhost側portを作業ブランチで一時的に変更して復旧を確認します。`docker system prune`や全container削除は使いません。

## 説明してみる

- restart前にlogsとexit codeを残す必要があるのはなぜか。
- `docker compose exec ... env`で環境変数を全表示する調査が危険なのはなぜか。

## 完了条件

- [ ] 3件のシグナルtestが成功した。
- [ ] 2種類の失敗をstatus・log・responseで分類した。
- [ ] 対象Compose環境だけを片付けた。
