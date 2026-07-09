# aws04 RDS接続 詳細設計

## 0. 関連文書

- `../requirements/aws04_rds_connection_requirements.md`
- `../basic_design/aws04_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/aws04_rds_connection/
  README.md
  docs/
src/backend/src/studyaws/systems/aws04_rds_connection/
  package.json
  Dockerfile or docker-compose.yml where applicable
  app/ api/ web/ src/ scripts/ events/ data/ storage as required by the local sample
src/infra/aws04_rds_connection/
  template.yaml where applicable
```

## 2. 実装詳細

- Docker ComposeでPostgreSQLを起動する前提を文書化する。
- `db_check.js`は環境変数の存在確認と接続設定の表示を行う。
- 実DB接続ライブラリは使わず、環境変数と接続先チェックを中心にする。
- `.env.example`にはダミー値のみを置く。
## 3. 実行コマンド
```powershell
npm run demo
npm run check
docker compose up -d
```

## 4. 確認手順
1. `.env.example`に実秘密情報がないことを確認する。
2. `npm run demo`で接続設定名が表示されることを確認する。
3. READMEのhost、port、database、user、passwordの意味を読む。
4. 接続失敗時チェックリストを確認する。
## 5. 実AWS発展課題
RDS作成、接続元制限、バックアップ、停止・削除、課金注意を整理してから実施する。DBをpublicにしない。
## 6. 完了条件

- RDS endpointとローカルDB接続先の対応を説明できる。
- DB接続情報を環境変数に分離できる。
- 接続失敗の切り分け観点を説明できる。
