# Job State

## 現実装

```text
queued -> running -> succeeded
```

| State | 意味 | 現在のdata |
|---|---|---|
| queued | 受付済み・未開始 | id, status |
| running | 実行中 | id, status |
| succeeded | 正常終了 | id, status, result |

## 要件上の発展

```text
queued -> running -> succeeded
                  └-> failed
queued / running -> canceled
```

failedには利用者向けerror code・messageと、開発者が追跡するrequest ID等を分けて持たせる。各状態から許可する遷移、retry時に同じjobを使うか新しいjobを作るかも決める。
