# aws09 簡易デプロイ

小型Web/APIをローカルで本番相当に起動し、環境変数、health、ログ、停止をデプロイの最小単位として学びます。クラウド公開は行いません。

## 到達目標

- build、release、runを区別できる。
- health checkと利用者向けendpointを分けられる。
- 公開後の確認、rollback、削除、課金確認を計画できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws09_simple_deploy/)
- [deployチェック](docs/deploy_checklist.md) / [サービス比較](docs/cloud_service_comparison.md)
- [要件定義](../../requirements/aws09_simple_deploy_requirements.md) / [基本設計](../../basic_design/aws09_basic_design.md) / [詳細設計](../../detailed_design/aws09_detailed_design.md)

## 15分で再開

```powershell
node category/StudyAWS\scripts\validate-studyaws.mjs aws09
```

Dockerで観察する場合:

```powershell
docker build -t studyaws-aws09 category/StudyAWS\src\backend\src\studyaws\systems\aws09_simple_deploy
docker run --rm -d --name studyaws-aws09 -p 4109:4109 -e APP_NAME=studyaws-docker studyaws-aws09
Invoke-RestMethod http://localhost:4109/health
docker logs studyaws-aws09
docker stop studyaws-aws09
```

health失敗、環境変数不足、起動後エラーの3場面で、rollbackか修正継続かを判断します。

## 境界と完了条件

ローカル起動はVercel、Render、Railway、Fly.io、App Runner等へのdeploy成功を証明しません。実公開前にURL、認証、secret、ログ、費用、削除方法を決めます。公開から後片付けまでのチェックリストを説明できれば完了です。
