# Docker調査チェックリスト

```cmd
docker compose ps
docker compose logs --tail 100 <service>
docker compose exec <service> env
curl http://localhost:<port>/health
curl http://localhost:<port>/ready
```

## 見るもの

- container status
- exit code
- restart count
- bind error
- missing env
- runtime error

secrets、token、password、個人情報は出力に含めない。
