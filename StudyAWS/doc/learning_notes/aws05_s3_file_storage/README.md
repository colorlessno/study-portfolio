# aws05 S3ファイル保存

ローカルディレクトリをS3 bucket相当として使い、upload/list/getとobject key検証を確認します。実S3には接続しません。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws05_s3_file_storage
npm run demo
npm run check
```
