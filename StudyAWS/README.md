# StudyAWS

AWS / cloud / infra の学習分野です。
`aws01` から `aws10` の教材を、実行コード、インフラ定義、工程文書、学習ノートに分けて配置しています。

## 学習の入口

- [リポジトリ全体の学習再開ガイド](../LEARNING_GUIDE.md)
- [全テーマカタログ](../THEME_CATALOG.md)
- 初めての場合は [aws01 IAM basics](./doc/learning_notes/aws01_iam_basics/README.md) から始めます。

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
Set-Location .\src\backend\src\studyaws\systems\aws07_lambda_local_api
npm run invoke
npm run check
```

SAM CLI がある場合

```powershell
sam local invoke HelloFunction -t .\src\infra\aws07_lambda_local_api\template.yaml -e .\src\backend\src\studyaws\systems\aws07_lambda_local_api\events\hello.json
```
