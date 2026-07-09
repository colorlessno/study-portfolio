# aws09 簡易デプロイ

ローカル本番相当の小型Web/APIです。実クラウド公開は発展課題として扱います。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws09_simple_deploy
npm run start
npm run check
docker build -t studyaws-aws09 .
docker run --rm -p 4109:4109 studyaws-aws09
```
