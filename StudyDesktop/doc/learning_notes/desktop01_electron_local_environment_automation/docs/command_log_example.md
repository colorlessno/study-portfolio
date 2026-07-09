# コマンドlog例

```json
{
  "taskId": "safe-install-plan",
  "runId": "20260507-143000-safe-install-plan",
  "status": "succeeded",
  "startedAt": "2026-05-07T14:30:00.000Z",
  "finishedAt": "2026-05-07T14:30:01.200Z",
  "exitCode": 0,
  "workspace": "workspace/20260507-143000-safe-install-plan",
  "steps": [
    "validate workspace",
    "write install plan",
    "write summary"
  ]
}
```

このlogは、アプリが何を実行すると決めたかを記録する。rendererはcommandを渡せないため、renderer由来のshell commandは記録されない。
