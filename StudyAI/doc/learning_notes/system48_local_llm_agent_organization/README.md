# system48 学習メモ
## ローカルLLMによるAI組み運用

## 目的
ローカルLLMを複数の役割として順に使いタスクボード、共有記、成果物、レビュー、QA、安確認でAI組みように運用する者方を学ぶ。
## 重要な者方

- 1つのAIに全ての情を渡すと、文脈が混ざり出力がぶれやすい、- 役割ごとに読む情と書く成果物を分ける、- エージェント同士は直接会話させず、文書で引き継ぐ、- 品質はレビュー、QA、安確認の複数観点で担当する、- 危険操成実行せず、人間確認または禁止として記録する。
## 教材の確認
```cmd
cd StudyAI\src\apps\system48_local_llm_agent_organization
node checks\check_task_board.js samples\task_board.json
node checks\check_task_fixture.js fixtures\task_success.json success
node checks\check_task_fixture.js fixtures\task_needs_approval.json needs_approval
node checks\check_task_fixture.js fixtures\task_missing_context.json missing_context
node checks\check_role_outputs.js samples
node checks\check_approval_boundary.js fixtures\task_needs_approval.json samples
```

## 商用APIへの領域替い
初期教材は模擬実行だけで確認できる。実LLM接続を追加する場合は、既存のStudyAI の共通方針に合わせて `AI_PROVIDER=commercial` または `AI_PROVIDER=custom` を使いOpenAI互換APIのURL、APIキー、モテ名を環境変数で持つ。画の力を使い場合は `CUSTOM_VLM_MODEL` でVision対応モテを分けられる。
## 関連文書

- `../../requirements/system48_local_llm_agent_organization_requirements.md`
- `../../basic_design/system48_basic_design.md`
- `../../detailed_design/system48_detailed_design.md`

