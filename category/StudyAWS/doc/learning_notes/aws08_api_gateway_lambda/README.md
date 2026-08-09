# aws08 API Gateway + Lambda

Node HTTPサーバーがHTTP requestをLambda eventへ変換し、handlerのresponseをHTTPへ戻す流れを観察します。SAM CLIなしで確認できます。

## 到達目標

- method、path、bodyがeventのどこへ入るか説明できる。
- 200、201、400、404の使い分けを説明できる。
- CORS、認証、throttling、ログが別の設計事項であると理解する。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws08_api_gateway_lambda/)
- [route設計](docs/route_design.md) / [proxy integrationメモ](docs/proxy_integration_notes.md)
- [要件定義](../../requirements/aws08_api_gateway_lambda_requirements.md) / [基本設計](../../basic_design/aws08_basic_design.md) / [詳細設計](../../detailed_design/aws08_detailed_design.md)

## 15分で再開

```powershell
node category/StudyAWS\scripts\validate-studyaws.mjs aws08
```

検証はGET、正常POST、不正JSON、存在しないrouteを一時portで確認して終了します。各requestがどのstatusになるか先に予想します。

SAM CLIとDockerがある場合だけ、次を追加実行します。

```powershell
sam local start-api -t category/StudyAWS\src\infra\aws08_api_gateway_lambda\template.yaml
```

確認後は`Ctrl+C`で停止します。実AWSへのdeployは行いません。

## 境界と完了条件

ローカルサーバーはAPI Gatewayの認証、CORS、stage、custom domain、quota、課金を再現しません。requestからevent、handler、responseまでを図示できれば完了です。
