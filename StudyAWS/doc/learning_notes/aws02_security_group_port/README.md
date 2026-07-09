# aws02 Security Group / port

Docker Composeの`ports`と`expose`で、公開通信と内部通信の違いを確認します。

```powershell
Set-Location ..\..\..\backend\src\studyaws\systems\aws02_security_group_port
npm run check
docker compose up
```

Dockerがない場合は`../../../doc/learning_notes/aws02_security_group_port/docs/network_matrix.md`の通信表を確認します。
