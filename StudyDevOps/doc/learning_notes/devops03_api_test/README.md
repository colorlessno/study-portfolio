# devops03 API test

API server に対して health、正常系、異常系、schema を確認する教材。
```powershell
docker compose -f src/apps/devops03_api_test/docker-compose.yml up --build --abort-on-container-exit
```

secrets、token、password、個人情は request / response に含めない
