# aws10 バックアップ / リストア

ダミーJSONを対象に、バックアップ作成とリストアのドライランを確認します。操作対象はこの教材ディレクトリ内に限定します。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws10_backup_restore
npm run backup
npm run restore -- --dry-run
npm run check
```
