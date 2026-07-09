# aws08 API Gateway + Lambda

Node HTTPサーバーでAPI Gateway相当の変換を行い、Lambda handlerへ渡します。SAM CLIがなくても確認できます。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws08_api_gateway_lambda
npm run start
npm run check
sam local start-api -t ..\..\..\..\..\infra\aws08_api_gateway_lambda\template.yaml
```
