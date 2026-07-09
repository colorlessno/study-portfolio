# devops06 request id付きログ

API request に request id を付けて JSON line log と response header で追跡する教材。
```powershell
npm.cmd --prefix src/apps/devops06_request_id_logging/app test
docker build -t studydevops-devops06 src/apps/devops06_request_id_logging
docker run --rm -p 18086:8080 studydevops-devops06
curl -i http://localhost:18086/ok
```

secrets、token、password、個人情はログに出さない
