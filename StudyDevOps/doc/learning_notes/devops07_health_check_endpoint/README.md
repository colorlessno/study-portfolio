# devops07 health check endpoint

`/health` と `/ready` の違い、Docker healthcheck、dependency failure を学ぶ教材。
```powershell
npm.cmd --prefix src/apps/devops07_health_check_endpoint/app test
docker compose -f src/apps/devops07_health_check_endpoint/docker-compose.yml up --build
curl http://localhost:18087/health
curl http://localhost:18087/ready
```

secrets は health / ready response に含めない
