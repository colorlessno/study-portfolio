# 障害調査Runbook

## 1. 初動

- 受付時刻
- 影響範囲
- severity
- 判断者

## 2. 状況確認

```cmd
curl /health
curl /ready
docker compose ps
docker compose logs --tail 100 <service>
```

## 3. 技術調査

- frontend
- API
- DB
- Docker
- recent change
- CI result

## 4. 一時対応

- workaround
- restart
- rollback

## 5. 恒久対応

- code fix
- config fix
- test追加
- Runbook更新

## 6. 再発防止

- 監視
- health check
- CI test
- review checklist

secrets、token、password、個人情報は記録しない。
