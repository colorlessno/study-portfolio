# aws03 EC2 + SSH

LinuxコンテナをEC2相当の疑似サーバーとして扱い、アプリ起動、port、ログを確認します。SSH秘密鍵は作成しません。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws03_ec2_ssh
npm run check
docker build -t studyaws-aws03 .
docker run --rm -p 4103:4103 studyaws-aws03
```
