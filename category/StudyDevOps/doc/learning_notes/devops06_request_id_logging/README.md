# devops06 request ID付きログ

目安: 20〜35分。1回のrequestをresponse headerとJSON Linesログの同じrequest IDで追い、正常・失敗の処理を結び付けます。

## このテーマでできるようになること

- request IDが「検索キー」であり、認証情報ではないことを説明する。
- `request_started`、`request_completed`、`request_failed`を同じIDで追う。
- query値や不適切な外部IDをログへ残さない境界を確認する。

## 成果物

- [要件定義](../../requirements/devops06_request_id_logging_requirements.md)
- [基本設計](../../basic_design/devops06_basic_design.md)
- [詳細設計](../../detailed_design/devops06_detailed_design.md)
- [server](../../../src/apps/devops06_request_id_logging/app/server.js)
- [logger](../../../src/apps/devops06_request_id_logging/app/logger.js)
- [自動テスト](../../../src/apps/devops06_request_id_logging/tests/logging.test.js)

## 始める前に予想する

1. 利用者から届いた`X-Request-Id`を無条件にログへ書くと何が起きるか。
2. URL全体ではなくpathnameだけをログへ残す理由は何か。

## 15分で再開する

テスト自身が専用portでserverを起動し、最大3秒の起動待ち後に正常系・500・ログ漏えいを確認して停止します。

```powershell
npm.cmd --prefix category/StudyDevOps/src/apps/devops06_request_id_logging/app ci
npm.cmd --prefix category/StudyDevOps/src/apps/devops06_request_id_logging/app test
```

期待結果は1件のtest成功です。Dockerログを自分で追う場合は次を使います。

```powershell
docker build -t studydevops-devops06 category/StudyDevOps/src/apps/devops06_request_id_logging
docker run -d --rm --name studydevops-devops06 -p 18086:8080 studydevops-devops06
curl.exe -i -H "X-Request-Id: req-learning-01" http://localhost:18086/fail
docker logs studydevops-devops06
docker stop studydevops-devops06
```

## 読む順番と観察点

1. `logger.js`で1行1JSONにする場所を確認する。
2. `server.js`で外部IDの許可文字と64文字上限を探す。
3. requestのqueryがログ用`path`から除かれることを確認する。
4. testで正常・失敗のIDとログactionを対応付ける。

## 安全に壊して直す

作業ブランチで`request_completed`を一時的に別名へ変え、ログassertionの失敗を確認します。元へ戻してtestを成功させます。実secret、token、password、個人情報を試験値に使いません。

## 説明してみる

- request IDがあっても分散traceそのものにはならないのはなぜか。
- response headerへ同じIDを返すと、問い合わせ調査がどう変わるか。

## 完了条件

- [ ] 自動テストが成功した。
- [ ] 正常系と500のログを同じIDで追った。
- [ ] ログへ残さない値と、その理由を説明した。
