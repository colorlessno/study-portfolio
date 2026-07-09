# 実行ログテンプレート

```json
{
  "run_id": "run-001",
  "task_id": "task-001",
  "mode": "mock",
  "started_at": "2026-05-09T00:00:00+09:00",
  "ended_at": "2026-05-09T00:00:10+09:00",
  "roles": [
    {
      "role": "planner",
      "status": "completed",
      "output": "plan.md",
      "notes": []
    }
  ],
  "checks": [
    {
      "name": "check_task_board",
      "status": "passed",
      "message": "required fields exist"
    }
  ],
  "failure_reason": null
}
```

## 記録する理由

AI組織は静かに壊れることがある。どのロールが何を出力し、どの検査が通ったかを残すことで、後から状態を追えるようにする。
