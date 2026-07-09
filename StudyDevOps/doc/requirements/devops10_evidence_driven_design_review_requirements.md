# devops10 要件定義
## Evidence-driven design review

## 1. 目的

Playwright、curl、DB確認、Docker logs、health check、trace、screenshot を組み合わせ、設計判断を実行証拠でレビューする方法を学ぶ。

## 2. 学習対象

- evidence collection
- Playwright trace / screenshot
- curl API evidence
- DB state evidence
- logs and request id
- health / readiness
- design review checklist

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 対象システムの確認観点チェックリストを作る |
| FR-02 | Playwright でUI操作証拠を取得する |
| FR-03 | curl でAPI応答証拠を取得する |
| FR-04 | DB状態、ログ、health check を確認する |
| FR-05 | 設計書の記述と実行証拠の一致・不一致をレビューする |

## 4. 非機能要件

- 証拠に秘密情報や個人情報を含めない。
- 失敗を隠さず、再現手順と原因仮説を残す。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- 本格監視基盤
- Visual regression test の網羅
- 実本番システムレビュー

## 6. 成果物

```text
StudyDevOps/
  doc/requirements/devops10_evidence_driven_design_review_requirements.md
  doc/basic_design/devops10_basic_design.md
  doc/detailed_design/devops10_detailed_design.md
  doc/learning_notes/devops10_evidence_driven_design_review/
```

## 7. 受入条件

- UI、API、DB、ログ、health の証拠を集められる。
- 設計と実行結果の差分を説明できる。
- レビュー結果を指摘事項、対処、残課題に分けて記録できる。
