# system46 詳細設計
## AI harness engineering

## 0. 関連文書

- `../requirements/system46_ai_harness_engineering_requirements.md`
- `../basic_design/system46_basic_design.md`

## 1. 製造対象

```text
apps/system46_ai_harness_engineering/
  README.md
  fixtures/
    task_success.json
    task_missing_input.json
    task_forbidden_operation.json
  checks/
    check_output_schema.js
    check_no_forbidden_ops.js
  samples/
    expected_output.md
doc/learning_notes/system46_ai_harness_engineering/
  README.md
  docs/
    harness_contract.md
    approval_boundary.md
    run_log_template.md
    feedback_loop.md
```

## 2. fixture設計

| fixture | 内容 | 期待結果 |
|---|---|---|
| `task_success.json` | 必須入力が揃った通常task | 成果物schema検査が通る |
| `task_missing_input.json` | targetやexpected outputが不足 | 不足入力として停止 |
| `task_forbidden_operation.json` | 削除や外部送信を求めるtask | approval boundaryまたは禁止として停止 |

## 3. harness contract 設計

| 項目 | 内容 |
|---|---|
| task goal | AIに依頼する目的 |
| allowed inputs | 読んでよいfixture、参照資料 |
| allowed outputs | markdown、JSON、検査ログ |
| forbidden actions | destructive operation、external send、secret handling |
| checks | schema検査、禁止操作検査、未処理マーカー検査 |
| run log | 実行日時、fixture、check結果、失敗理由 |

## 4. check設計

| check | 入力 | 検査内容 |
|---|---|---|
| `check_output_schema.js` | output markdown / JSON | 必須章、必須項目、空出力 |
| `check_no_forbidden_ops.js` | task fixture / output | 禁止操作語、外部送信、秘密情報要求 |

checkはAI品質を完全評価するものではなく、最低限の再現性と安全境界を確認する。

## 5. approval boundary 設計

| operation | 扱い |
|---|---|
| read fixture | 許可 |
| write output under sample dir | 許可 |
| delete generated sample output | 条件付き許可 |
| delete arbitrary path | 禁止 |
| external API call | 禁止 |
| handle secrets | 禁止 |

## 6. run log 設計

| field | 内容 |
|---|---|
| `run_id` | 実行単位ID |
| `fixture` | 使用したfixture |
| `started_at` / `ended_at` | 実行時刻 |
| `checks` | check名、結果、メッセージ |
| `failure_reason` | 失敗時の理由 |
| `rerun_condition` | 再実行に必要な変更 |

## 7. 確認手順

1. success fixtureで成果物を作成する
2. schema checkを実行する
3. missing input fixtureで停止理由を記録する
4. forbidden operation fixtureで承認境界を確認する
5. run logとfeedback memoを更新する

## 8. 完了条件

- fixture、check、approval、logの役割を説明できる
- AI作業を再実行可能にする要素を列挙できる
- 禁止操作を検査可能な形にできる

## 9. 安全性

- 実秘密情報、実顧客データ、破壊的操作を扱わない
- checkは教材ディレクトリ内のfixtureとoutputだけを対象にする
- 外部AI API課金を伴う検証は行わない

