# system48 ローカルLLMによるAI組織運用

## 目的

複数のAIロールを、直接会話ではなくタスクボード、共有記憶、成果物、判断ログで連携させる構成を学ぶための最小教材です。

この教材は外部AI APIに依存しません。初期状態では `samples/` にある模擬成果物を確認スクリプトで検査します。LM Studio などのローカルLLM接続は後続拡張です。

## 構成

```text
fixtures/
  task_success.json
  task_needs_approval.json
  task_missing_context.json
  role_catalog.json
  shared_memory.md
samples/
  task_board.json
  plan.md
  design_note.md
  execution_proposal.md
  review_report.md
  qa_checklist.md
  safety_report.md
  decision_log.md
  final_report.md
  run_log.json
checks/
  check_task_board.js
  check_role_outputs.js
  check_approval_boundary.js
```

## 確認手順

```cmd
node checks\check_task_board.js samples\task_board.json
node checks\check_task_fixture.js fixtures\task_success.json success
node checks\check_task_fixture.js fixtures\task_needs_approval.json needs_approval
node checks\check_task_fixture.js fixtures\task_missing_context.json missing_context
node checks\check_role_outputs.js samples
node checks\check_approval_boundary.js fixtures\task_needs_approval.json samples
```

## 学習ポイント

- 1つのAIに全情報を渡さず、ロールごとに文脈を分ける
- タスクボードを中心に、非同期で成果物を受け渡す
- レビュー、QA、安全確認を別ロールとして扱う
- 危険操作は実行せず、承認待ちまたは禁止として記録する
- ローカルLLM未接続でも模擬実行で流れを確認する
