# aws02 Security Group / port 詳細設計

## 0. 関連文書

- `../requirements/aws02_security_group_port_requirements.md`
- `../basic_design/aws02_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/aws02_security_group_port/
  README.md
  docs/
src/backend/src/studyaws/systems/aws02_security_group_port/
  package.json
  Dockerfile or docker-compose.yml where applicable
  app/ api/ web/ src/ scripts/ events/ data/ storage as required by the local sample
src/infra/aws02_security_group_port/
  template.yaml where applicable
```

## 2. 実装詳細

- `docker-compose.yml`でweb、api、db相当サービスを定義する。
- webだけをホスト公開し、api/dbは内部通信として扱う。
- DB相当は実DBではなく軽量なダミーサービスまたはコメント定義にする。
- Security Groupの概念は`docs/network_matrix.md`に対応表として残す。
## 3. 実行コマンド
```powershell
docker compose up
docker compose ps
```

Dockerが使えない場合はREADMEの通信表だけで確認できる構成にする。
## 4. 確認手順
1. 公開対象ポートがwebだけであることを確認する。
2. webからapiへ通信できる構成を確認する。
3. db相当を外部公開しない理由を読む。
4. `0.0.0.0/0`を許可してよい通信と危険な通信を分類する。
## 5. 実AWS発展課題
Security GroupでHTTPだけ公開し、DBはアプリSecurity Groupからのみ許可する。SSHを使う場合は送信元制限を必須にする。
## 6. 完了条件

- 公開ポートと内部ポートを区別できる。
- Security GroupとDocker port mappingの違いを説明できる。
- 接続不可時の確認項目を説明できる。
