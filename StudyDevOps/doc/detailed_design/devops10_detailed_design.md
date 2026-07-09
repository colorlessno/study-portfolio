# devops10 詳細設計
## Evidence-driven design review

## 0. 関連文書

- `../requirements/devops10_evidence_driven_design_review_requirements.md`
- `../basic_design/devops10_basic_design.md`

## 1. 正規ルートとの関係

このテーマの正規ルートは `StudyArchitecture arch02` である。`devops10` は `StudyDevOps` 側の重複候補として詳細設計を残すが、教材実装の開始点にはしない。

## 2. 製造対象

```text
doc/learning_notes/devops10_evidence_driven_design_review/
  README.md
  docs/
    evidence_checklist.md
    ui_api_db_log_evidence.md
    design_review_findings.md
    residual_risk.md
```

## 3. evidence checklist 設計

| area | evidence | command/source |
|---|---|---|
| UI | screenshot、trace | Playwright |
| API | status、header、body | curl |
| DB | query result、state change | psql/sqlite |
| logs | request id、error、duration | Docker logs |
| health | liveness、readiness | health endpoint |

## 4. finding 設計

| field | 内容 |
|---|---|
| id | `D-001`形式 |
| evidence | 証拠 |
| design statement | 設計書の記述 |
| mismatch | 不一致内容 |
| impact | 影響 |
| fix candidate | 対処候補 |
| residual risk | 残リスク |

## 5. 確認手順

1. `StudyArchitecture arch02` の詳細設計を正規テンプレートとして確認する
2. DevOps寄りの証拠収集観点を整理する
3. UI、API、DB、logs、healthの証拠を対応表にする
4. 不一致をfinding化する
5. residual riskを記録する

## 6. 完了条件

- UI、API、DB、logs、healthの証拠を組み合わせられる
- 設計と実行結果の差分を説明できる
- `StudyArchitecture arch02` との関係を説明できる

## 7. 安全性

- 証拠に秘密情報や個人情報を含めない
- 本番システムレビューは対象にしない
- 正規ルートを変更しない限り、教材実装は `arch02` から開始する

