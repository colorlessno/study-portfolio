# Retry Policy

| 失敗 | 例 | Retry判断 |
|---|---|---|
| timeout | 一時的な遅延・network不調 | 条件付きで対象 |
| 429 | rate limit | `Retry-After`等に従う |
| 503 | 一時的なservice unavailable | 対象候補 |
| 400 | request内容不正 | 原則retryしない |
| 401 / 403 | 認証・権限 | 条件を直さずretryしない |
| 404 | 対象なし | 通常retryしない |

## 最小方針例

- max attempts: 3
- timeout per attempt: 1秒
- backoff: 100ms → 200ms
- retry対象: timeout、429、503
- 非対象: その他の400系
- POST等の副作用操作: 冪等性を確認してからretry

retry回数だけでなく、attempt timeoutとbackoffを含む全体時間にも上限を持たせる。複数clientが同時retryする場合はjitterも検討する。
