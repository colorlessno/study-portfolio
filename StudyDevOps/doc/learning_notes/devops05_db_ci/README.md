# devops05 DB付きCI

目安: 25〜45分。PostgreSQLの起動、health check、schema、seed、testをDocker Composeでつなぎ、DBを含むCIの待機条件と後片付けを学びます。

## このテーマでできるようになること

- process起動とDB利用可能状態の違いを説明する。
- schema、seed、test dataの役割を区別する。
- test後に作成データとcontainer volumeを片付ける。

## 成果物

- [要件定義](../../requirements/devops05_db_ci_requirements.md)
- [基本設計](../../basic_design/devops05_basic_design.md)
- [詳細設計](../../detailed_design/devops05_detailed_design.md)
- [DB test](../../../src/apps/devops05_db_ci/tests/db.test.js)
- [schema](../../../src/apps/devops05_db_ci/db/schema.sql)
- [seed](../../../src/apps/devops05_db_ci/db/seed.sql)
- [Docker Compose](../../../src/apps/devops05_db_ci/docker-compose.yml)

## 始める前に予想する

1. containerが起動済みでも、すぐSQLを受け付けられないことがあるのはなぜか。
2. seed dataとtest中に追加するdataを分けると、何を検証しやすいか。

## 15分で再開する

Docker Desktopを起動し、リポジトリルートから実行します。

```powershell
docker compose -f StudyDevOps/src/apps/devops05_db_ci/docker-compose.yml up --build --abort-on-container-exit --exit-code-from test
docker compose -f StudyDevOps/src/apps/devops05_db_ci/docker-compose.yml down --volumes
```

期待結果は`db test ok`と終了コード0です。`down --volumes`はこの教材で作ったDB volumeを削除し、次回も同じ初期状態から試せるようにします。

## 読む順番と観察点

1. schemaでtableとcolumnを確認する。
2. seedで初期状態を予想する。
3. testでinsert、select、deleteの順序を追う。
4. Composeのhealth checkと`condition: service_healthy`を対応付ける。

testはseed taskと追加したtest taskの両方を確認します。接続できたことだけを成功条件にしていない点を観察します。

## 安全に壊して直す

作業ブランチでtestが参照するtable名を一時的に誤らせ、PostgreSQLのエラーがCIログにどう出るか確認します。元に戻し、volumeを削除してから再実行します。

## 説明してみる

- DB付きtestがunit testより遅く、環境差の影響を受けやすいのはなぜか。
- CIごとにDBを初期化することが、再現性にどう関係するか。

## 制約と完了条件

教材用固定値だけを使い、本番DB、secret、個人情報へ接続しません。

- [ ] DB testが終了コード0で成功した。
- [ ] health、schema、seed、testの順序を説明した。
- [ ] 失敗を調査し、volumeを含めて後片付けした。
