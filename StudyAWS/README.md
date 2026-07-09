# StudyAWS

AWS / cloud / infra の学習分野です。
既存の `Lamdab` フォルダは触らず、`aws01` から `aws10` の教材は StudyAI 型に合わせて共通領域へ配置しています。

## 構成

| 領域 | 内容 |
|---|---|
| `src/backend/src/studyaws/systems/` | 各教材の実行コード、package.json、Dockerfile、local invoke 用データ |
| `src/infra/` | SAM template などのインフラ定義 |
| `doc/learning_notes/` | 各教材の README と補足ドキュメント |
| `doc/requirements/` | 要件定義 |
| `doc/basic_design/` | 基本設計 |
| `doc/detailed_design/` | 詳細設計 |
| `doc/reviews/` | 自己レビュー |

## 方針
- まずローカルで疑似実行できる構成を優先する。
- Lambda、API Gateway、S3、SQS、DynamoDB は AWS SAM CLI、LocalStack、Docker Compose などでの確認を候補にする。
- 実AWSを使う場合は、課金、権限、削除手順を明記した発展課題として扱う。
- 実アクセスキーや秘密情報は置かない。

## 実行例

```powershell
Set-Location .\backend\src\studyaws\systems\aws07_lambda_local_api
npm run invoke
npm run check
```

SAM CLI がある場合

```powershell
sam local invoke HelloFunction -t .\infra\aws07_lambda_local_api\template.yaml -e .\backend\src\studyaws\systems\aws07_lambda_local_api\events\hello.json
```
