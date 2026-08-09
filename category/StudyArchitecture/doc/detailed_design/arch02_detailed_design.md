# arch02 詳細設計
## Evidence-driven design review

## 0. 関連文書

- `../requirements/arch02_evidence_driven_design_review_requirements.md`
- `../basic_design/arch02_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/arch02_evidence_driven_design_review/
  README.md
  docs/
    review_target.md
    evidence_checklist.md
    evidence_mapping.md
    findings.md
    residual_risk.md
    review_result_template.md
```

## 2. review target 設計

| 項目 | 内容 |
|---|---|
| target system | レビュー対象 |
| design docs | 要件定義、基本設計、詳細設計など |
| review scope | UI、API、DB、logs、healthのうち対象にする範囲 |
| out of scope | 今回確認しない画面、API、非機能 |
| preconditions | 起動状態、seed data、必要コマンド |

## 3. evidence checklist 設計

| area | evidence | command / source | artifact |
|---|---|---|---|
| UI | 画面操作、表示結果 | Playwright | screenshot、trace |
| API | status、header、body | curl | response log |
| DB | table、row、state change | psql / sqlite cli | query result |
| logs | request id、error、duration | Docker logs / app log | log excerpt |
| health | liveness、readiness | curl / compose ps | health log |

## 4. evidence mapping 設計

| design statement | expected evidence | actual evidence | result |
|---|---|---|---|
| 設計書の記述 | 期待する確認結果 | 実際の証拠 | match / mismatch / unknown |

`unknown` は証拠不足を表す。推測でmatch扱いにしない。

## 5. finding 設計

| field | 内容 |
|---|---|
| id | `F-001` 形式 |
| severity | high、medium、low |
| summary | 指摘の要約 |
| evidence | 証拠ファイルまたはコマンド結果 |
| impact | 影響 |
| fix candidate | 対処候補 |
| status | open、fixed、accepted risk |

## 6. residual risk 設計

| risk | reason | next action |
|---|---|---|
| 未確認領域 | 時間や環境制約で証拠未取得 | 後続レビューで確認 |
| flaky evidence | 実行結果が安定しない | 再現条件を追加 |
| partial fix | 一部だけ対処済み | 残作業をissue化 |

## 7. 確認手順

1. review targetとscopeを定義する
2. evidence checklistを作る
3. UI、API、DB、logs、healthの証拠を取得する
4. design statementとevidenceをmappingする
5. mismatchとunknownをfinding化する
6. 対処済み、未対処、残リスクを記録する

## 8. 完了条件

- 設計文書と実行証拠を対応付けられる
- Playwright、curl、DB、logs、healthを組み合わせて確認できる
- finding、fix、residual riskを分けて記録できる

## 9. 安全性

- 証拠に秘密情報や個人情報を含めない
- 本番システムや実障害レビューを対象にしない
- 失敗を隠さず、再現条件と残リスクを記録する

