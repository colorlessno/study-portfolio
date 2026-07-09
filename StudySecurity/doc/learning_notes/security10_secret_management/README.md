# security10 秘密情報管理

必須環境変数の有無を起動時に検証します。値はログに出さず、設定名だけを表示します。

```powershell
$env:APP_SECRET="example-app-secret"; $env:WEBHOOK_SECRET="example-webhook-secret"; npm run demo
```
