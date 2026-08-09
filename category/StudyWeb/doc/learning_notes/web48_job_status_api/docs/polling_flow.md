# Polling Flow

```text
client -- POST /jobs ----------> API
client <- 202 { id, queued } ---- API

client -- GET /jobs/:id -------> API
client <- 200 { running } ------- API
          wait with interval
client -- GET /jobs/:id -------> API
client <- 200 { succeeded } ----- API
          stop polling
```

## Pollingを止める条件

- `succeeded / failed / canceled`等の終端状態
- 最大回数へ到達
- 全体timeoutへ到達
- 利用者が画面を離れた・cancelした
- 404等、継続しても回復しないresponse

短すぎる間隔はAPI負荷を増やす。固定間隔、backoff、server指定の次回確認時刻、SSE / WebSocket等を要件に応じて比較する。

このサンプルは約900msで完了するが、実務では無制限の常時pollingを行わない。
