# aws04 RDS接続

RDS接続で必要になる接続情報を、ローカルPostgreSQL相当の設定として整理します。実DB接続ライブラリは使わず、設定分離を確認します。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws04_rds_connection
$env:DB_HOST="localhost"; $env:DB_PORT="54324"; $env:DB_NAME="studyaws"; $env:DB_USER="studyaws"; $env:DB_PASSWORD="example-password"; npm run demo
npm run check
```
