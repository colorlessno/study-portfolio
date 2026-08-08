# aws03 EC2 / SSH

Linuxコンテナを疑似サーバーとして扱い、プロセス、health、port、ログ、停止を確認します。SSH秘密鍵やEC2は作成しません。

## 到達目標

- サーバーへ接続できることと、アプリが正常であることを区別できる。
- health、アプリログ、port公開を調査順に並べられる。
- SSH鍵、送信元制限、Session Manager、インスタンス削除の論点を説明できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws03_ec2_ssh/)
- [サーバー確認表](docs/server_checklist.md) / [SSH鍵の注意](docs/ssh_key_notes.md)
- [要件定義](../../requirements/aws03_ec2_ssh_requirements.md) / [基本設計](../../basic_design/aws03_basic_design.md) / [詳細設計](../../detailed_design/aws03_detailed_design.md)

## 15分で再開

```powershell
node StudyAWS\scripts\validate-studyaws.mjs aws03
```

Dockerで観察する場合:

```powershell
docker build -t studyaws-aws03 StudyAWS\src\backend\src\studyaws\systems\aws03_ec2_ssh
docker run --rm -d --name studyaws-aws03 -p 4103:4103 studyaws-aws03
Invoke-RestMethod http://localhost:4103/health
docker logs studyaws-aws03
docker stop studyaws-aws03
```

healthが失敗した場合の確認順を、コンテナ、プロセス、listen port、ログ、通信経路の順で記録します。

## 境界と完了条件

コンテナはEC2、IAM role、EBS、metadata service、Security Groupを再現しません。実EC2は課金が継続し得るため、作成前に停止と削除の違いを確認します。正常確認と障害切り分けを説明できれば完了です。
