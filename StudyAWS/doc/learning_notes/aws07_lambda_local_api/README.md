# aws07 Lambda最小API

Lambda handlerをローカルで直接呼び出します。SAM CLIがある場合だけ`sam local invoke`も試せます。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws07_lambda_local_api
npm run invoke
npm run check
sam local invoke HelloFunction -t ..\..\..\..\..\infra\aws07_lambda_local_api\template.yaml -e events\hello.json
```
