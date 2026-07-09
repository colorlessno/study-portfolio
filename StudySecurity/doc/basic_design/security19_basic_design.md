# security19 Tool実行前承認 基本設計
## 0. 関連要件

- `../requirements/security19_tool_approval_requirements.md`

## 1. 設計目的
AIが提案した操作を即実行せず、人間承認とallowlistを通す設計を確認する。
## 2. 対象範囲

- tool request
- approval queue
- allowlist
- approve / reject
- audit log

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security19_data_retention/
  README.md
  app/
  docs/tool_approval_flow.md
  docs/audit_log.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| proposed action | AI提案操作 |
| approver decision | approve / reject |

## 5. 出力
| 出力 | 内容 |
|---|---|
| pending item | 承認待ち |
| decision result | 許可・拒否 |
| audit log | 操作履歴 |

## 6. 処理方針
1. AI提案操作を承認待ちにする
2. allowlist外は拒否する
3. 人間承認後に実行済みにする
4. 実破壊操作は行わない
5. 監査ログを残す

## 7. 確認観点

- AI判断だけで実行していないか
- 危険操作が疑似操作に限定されているか
- 承認者と実行者を区別できるか
## 8. 後続工程への引き継ぎ

詳細設計では、操作schema、承認状態、allowlist、監査ログを定義する。
