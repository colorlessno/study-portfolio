# devops03 API test

目安: 25〜40分。実際にHTTP serverを起動し、死活確認、正常系、入力異常、404を外側から検証します。

## このテーマでできるようになること

- unit testとAPI integration testの境界を説明する。
- status codeと`error_code`を使って失敗の種類を確認する。
- 不正JSONを受けてもprocessが落ちず、次のrequestを処理できることを検証する。

## 成果物

- [要件定義](../../requirements/devops03_api_test_requirements.md)
- [基本設計](../../basic_design/devops03_basic_design.md)
- [詳細設計](../../detailed_design/devops03_detailed_design.md)
- [API server](../../../src/apps/devops03_api_test/app/server.js)
- [API test](../../../src/apps/devops03_api_test/tests/api.test.js)
- [Docker Compose](../../../src/apps/devops03_api_test/docker-compose.yml)

## 始める前に予想する

1. JSONが壊れている場合と、JSONは正しいが`name`がない場合を同じエラーにすべきか。
2. 異常なrequestの直後に`/health`を呼ぶtestにはどんな意味があるか。

## 15分で再開する

Docker Desktopを起動し、リポジトリルートから実行します。

```powershell
docker compose -f StudyDevOps/src/apps/devops03_api_test/docker-compose.yml up --build --abort-on-container-exit --exit-code-from test
docker compose -f StudyDevOps/src/apps/devops03_api_test/docker-compose.yml down --volumes
```

期待結果は2件のtestが成功し、終了コードが0になることです。後片付けでは、この教材のコンテナとネットワークだけを削除します。

## 読む順番と観察点

1. 詳細設計のendpointとtest caseを読む。
2. `api.test.js`で、request、期待status、response検証を対応付ける。
3. `server.js`で64 KiBのbody上限とJSON parse失敗時の応答を探す。
4. Composeでtest containerが`http://api:8080`を使う理由を確認する。

API起動待ちはtest内で最大5秒に制限しています。常時監視ではなく、起動直後だけを対象にした有限のretryです。

## 安全に壊して直す

作業ブランチでtestの期待statusを一時的に誤った値へ変え、失敗ログにactualとexpectedが出ることを確認します。元に戻して再実行し、終了コード0を確認します。

## 説明してみる

- `depends_on`だけではAPIがrequest受付可能になったことまで保証しないのはなぜか。
- 不正JSONのtest後にhealth checkを行うことで、何を追加で証明できるか。

## 制約と完了条件

itemはmemory上に保存し、認証や永続化は対象外です。request / responseにsecret、token、password、個人情報を含めません。

- [ ] ComposeによるAPI testが成功した。
- [ ] 正常系と2種類の400を区別して説明した。
- [ ] 失敗ログを読み、修正後の成功まで確認した。
