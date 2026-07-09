# devops05 DB付きCI

PostgreSQL、schema、seed、test めるDocker Compose で実行する教材。
```powershell
docker compose -f src/apps/devops05_db_ci/docker-compose.yml up --build --abort-on-container-exit
```

secrets は使わず、教材用固定値だけを使い
