# curl確認

```powershell
curl.exe -i http://localhost:3032/api/hello
curl.exe -i -X POST http://localhost:3032/api/echo -H "Content-Type: application/json" -d "{\"message\":\"hello\"}"
```
