# system48 詳細設計
## ローカルLLMによるAI組織運用

## 0. 関連文書

- `../requirements/system48_local_llm_agent_organization_requirements.md`
- `../basic_design/system48_basic_design.md`

## 1. 製造対象

```text
apps/system48_local_llm_agent_organization/
  README.md
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
    check_task_fixture.js
    check_task_board.js
    check_role_outputs.js
    check_approval_boundary.js
doc/learning_notes/system48_local_llm_agent_organization/
  README.md
  docs/
    role_catalog.md
    task_board_contract.md
    shared_memory_policy.md
    approval_boundary.md
    run_log_template.md
```

## 2. 実行モード

| mode | 内容 | 用途 |
|---|---|---|
| `mock` | 固定応答で各ロールの成果物を作る | LM Studio未接続時、教材確認 |
| `local_llm` | LM Studio の OpenAI互換APIへ順番に問い合わせる | ローカルLLMでの実験 |

初期製造では `mock` を必須とする。`local_llm` は任意接続とし、未接続でも教材の確認手順が止まらないようにする。

## 3. fixture設計

| fixture | 内容 | 期待結果 |
|---|---|---|
| `task_success.json` | 目的、制約、期待成果物が揃った通常タスク | 全ロール成果物と最終報告が作成される |
| `task_needs_approval.json` | ファイル変更やコマンド実行を含むタスク | 安全確認で承認待ちとして停止または保留になる |
| `task_missing_context.json` | 目的や制約が不足したタスク | 計画担当または調整役が不足情報として停止する |
| `role_catalog.json` | ロール定義、読む入力、書く成果物、判断範囲 | 各ロールの責任境界を検査できる |
| `shared_memory.md` | プロジェクト方針、禁止事項、既存決定 | 各ロールが共通制約を参照できる |

## 4. `task_board.json` 設計

```json
{
  "task_id": "task-001",
  "title": "学習教材の設計案を作る",
  "status": "in_review",
  "current_role": "reviewer",
  "mode": "mock",
  "round": 1,
  "max_rounds": 2,
  "required_outputs": [
    "plan.md",
    "design_note.md",
    "review_report.md",
    "qa_checklist.md",
    "safety_report.md",
    "final_report.md"
  ],
  "blocked_reason": null,
  "approval_required": [],
  "completed_roles": ["coordinator", "planner", "designer"]
}
```

| field | 内容 |
|---|---|
| `task_id` | タスクID |
| `title` | タスク名 |
| `status` | `new`、`in_progress`、`in_review`、`blocked`、`completed` |
| `current_role` | 現在の担当ロール |
| `mode` | `mock` または `local_llm` |
| `round` / `max_rounds` | 現在ラウンドと上限 |
| `required_outputs` | 完了に必要な成果物 |
| `blocked_reason` | 停止または保留理由 |
| `approval_required` | 人間確認が必要な操作 |
| `completed_roles` | 完了済みロール |

## 5. `role_catalog.json` 設計

```json
{
  "roles": [
    {
      "id": "planner",
      "name": "計画担当",
      "reads": ["task_board.json", "shared_memory.md"],
      "writes": ["plan.md"],
      "can_decide": ["作業順序案", "対象外案"],
      "must_not_do": ["ファイル変更", "コマンド実行", "外部送信"]
    }
  ]
}
```

全ロールは `reads`、`writes`、`can_decide`、`must_not_do` を持つ。これにより、ロールごとの文脈分離と権限境界を検査できるようにする。

## 6. ロール成果物テンプレート

| ファイル | 必須章 |
|---|---|
| `plan.md` | 目的、対象外、作業順序、不足情報 |
| `design_note.md` | 構成、データ、境界、失敗時の扱い |
| `execution_proposal.md` | 実行案、変更対象、実行しない操作、承認待ち |
| `review_report.md` | 指摘事項、重大度、対応案、残リスク |
| `qa_checklist.md` | 確認観点、機械的検査、受入条件 |
| `safety_report.md` | 禁止操作、承認待ち操作、秘密情報確認 |
| `decision_log.md` | 判断、理由、参照成果物、次回引き継ぎ |
| `final_report.md` | 結論、作成物、残課題、次の作業 |

各Markdown成果物は、空の章だけで完了扱いにしない。少なくとも1件以上の具体項目を含める。

## 7. ロール実行順序

```text
coordinator
  ↓
planner
  ↓
designer
  ↓
executor
  ↓
reviewer
  ↓
qa
  ↓
safety
  ↓
recorder
  ↓
coordinator
```

レビュー、QA、安全確認で重大指摘がある場合は `blocked` にする。軽微な指摘は `decision_log.md` に残し、最終報告へ反映する。

## 8. ローカルLLM呼び出し設計

| 項目 | 内容 |
|---|---|
| endpoint | LM Studio の OpenAI互換API |
| 呼び出し単位 | 1ロール1リクエスト |
| 入力 | ロール指示、読むべき成果物、共有記憶の必要部分 |
| 出力 | ロール成果物Markdown |
| 失敗時 | `mock` に切り替えるか、`blocked_reason` に接続失敗を記録する |

複数ロールを同時に呼ばない。ローカルPCのVRAM制約を前提に、順次実行で設計する。

## 9. 承認境界設計

| 操作 | 扱い | 記録先 |
|---|---|---|
| 要約、計画、レビュー、QA観点作成 | 許可 | 各ロール成果物 |
| 教材内サンプル出力の作成 | 条件付き許可 | `run_log.json` |
| ファイル変更 | 人間確認 | `safety_report.md`、`task_board.json` |
| コマンド実行 | 人間確認 | `safety_report.md`、`task_board.json` |
| 外部送信 | 人間確認または禁止 | `safety_report.md` |
| 秘密情報の利用 | 禁止 | `safety_report.md` |
| ファイル削除の自律実行 | 禁止 | `safety_report.md` |

教材では、危険操作は実行せず、承認待ちまたは禁止として記録する。

## 10. `run_log.json` 設計

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

## 11. check設計

| check | 入力 | 検査内容 |
|---|---|---|
| `check_task_fixture.js` | `fixtures/*.json` | 通常タスク、承認待ちタスク、文脈不足タスクの期待状態 |
| `check_task_board.js` | `task_board.json` | 必須項目、状態値、最大ラウンド、承認待ち項目の型 |
| `check_role_outputs.js` | `samples/*.md` | 必須成果物、必須章、空章、未処理マーカー |
| `check_approval_boundary.js` | fixture、成果物 | 禁止操作、秘密情報語、外部送信、削除操作の記述 |

checkはAI出力の良し悪しを完全評価しない。教材として最低限の構造、安全境界、再実行可能性を確認する。

## 12. 確認手順

1. `task_success.json` を使い、`mock` モードで各ロール成果物を作成する。
2. `check_task_fixture.js` で通常タスク、承認待ちタスク、文脈不足タスクの期待状態を確認する。
3. `check_task_board.js` でタスクボードの必須項目を確認する。
4. `check_role_outputs.js` で各Markdown成果物の必須章を確認する。
5. `task_needs_approval.json` を使い、承認待ちとして記録されることを確認する。
6. `check_approval_boundary.js` で禁止操作が実行済み扱いになっていないことを確認する。
7. `task_missing_context.json` を使い、不足情報として停止できることを確認する。
8. `run_log.json` に実行モード、ロール結果、検査結果、停止理由が残ることを確認する。

## 13. 完了条件

- タスクボード、ロール定義、共有記憶、判断ログの役割を説明できる。
- ロールごとに読む入力と書く成果物を分けられる。
- ローカルLLM未接続時でも模擬実行で学習できる。
- 危険操作が実行されず、承認待ちまたは禁止として記録される。
- 確認スクリプトで、必須成果物、承認境界、停止理由を確認できる。

## 14. 安全性

- 実秘密情報、実顧客データ、個人情報を使わない。
- 外部送信、ファイル削除、OS設定変更をAIが自律実行しない。
- コマンド実行は教材の確認スクリプトに限定し、危険操作の実行は扱わない。
- ローカルLLMの出力は最終判断ではなく、レビュー、QA、安全確認を通す。
