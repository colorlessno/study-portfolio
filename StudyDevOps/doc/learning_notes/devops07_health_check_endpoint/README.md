# devops07 health check endpoint

目安: 20〜35分。processが生きていることと、依存先を含めてrequestを受けられることを`/health`と`/ready`で分離します。

## このテーマでできるようになること

- livenessとreadinessの判定対象を区別する。
- 依存先障害時に`/health`は200、`/ready`は503になる理由を説明する。
- Docker healthcheckと外部smoke testの役割を比較する。

## 成果物

- [要件定義](../../requirements/devops07_health_check_endpoint_requirements.md)
- [基本設計](../../basic_design/devops07_basic_design.md)
- [詳細設計](../../detailed_design/devops07_detailed_design.md)
- [server](../../../src/apps/devops07_health_check_endpoint/app/server.js)
- [自動テスト](../../../src/apps/devops07_health_check_endpoint/tests/health.test.js)
- [Docker Compose](../../../src/apps/devops07_health_check_endpoint/docker-compose.yml)

## 始める前に予想する

1. DB障害だけでprocessを再起動し続けると、どんな悪化が起こり得るか。
2. health responseに接続文字列を含めてはいけないのはなぜか。

## 15分で再開する

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops07_health_check_endpoint/app ci
npm.cmd --prefix StudyDevOps/src/apps/devops07_health_check_endpoint/app test
```

testはserverを一時起動し、ready→依存障害→503→health 200→復旧まで確認して停止します。Dockerのhealth statusを1回確認する場合は次を使います。

```powershell
docker compose -f StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml up -d --build
docker compose -f StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml ps
curl.exe http://localhost:18087/health
curl.exe http://localhost:18087/ready
docker compose -f StudyDevOps/src/apps/devops07_health_check_endpoint/docker-compose.yml down
```

## 読む順番と観察点

1. 詳細設計でhealthとreadyの期待statusを比較する。
2. serverの`dependencyOk`がどちらのendpointへ影響するか追う。
3. testで503中もhealthが200であるassertionを探す。
4. Composeのhealthcheckがどちらを呼ぶか確認する。

`POST /toggle-dependency`は教材専用の障害注入入口であり、本番APIの設計例ではありません。

## 安全に壊して直す

作業ブランチでready失敗時のstatusを一時的に200へ変え、testが失敗することを確認します。503へ戻し、再実行して成功させます。

## 説明してみる

- healthとreadyを同じendpointにすると運用判断が曖昧になるのはなぜか。
- Docker healthcheckが成功しても、利用者の全操作成功までは証明しないのはなぜか。

## 完了条件

- [ ] 正常、依存障害、復旧のtestが成功した。
- [ ] 200と503の意味を説明した。
- [ ] responseへ含めない内部情報を説明した。
