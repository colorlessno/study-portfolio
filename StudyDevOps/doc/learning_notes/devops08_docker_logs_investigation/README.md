# devops08 Docker logs調査

`docker compose ps`、`logs`、`exec` で起動失敗と runtime error をりける教材。
```powershell
docker compose -f src/apps/devops08_docker_logs_investigation/docker-compose.yml up --build
docker compose -f src/apps/devops08_docker_logs_investigation/docker-compose.yml ps
docker compose -f src/apps/devops08_docker_logs_investigation/docker-compose.yml logs app-missing-env
docker compose -f src/apps/devops08_docker_logs_investigation/docker-compose.yml logs app-runtime-error
```

secrets は logs と調査メモに残さない
