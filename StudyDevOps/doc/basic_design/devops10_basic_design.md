# devops10 基本設計
## Evidence-driven design review

## 1. 設計目的

Playwright、curl、DB確認、Docker logs、health check、trace、screenshot を組み合わせ、設計書と実行証拠の一致・不一致をレビューする教材にする。

## 2. 正規ルートとの関係

このテーマの正規ルートは `StudyArchitecture arch02` とする。`devops10` は `StudyDevOps` 側の重複候補として残し、詳細設計へ進める場合は `arch02` との重複を再確認する。

## 3. 配置方針

```text
StudyDevOps/
  doc/learning_notes/devops10_evidence_driven_design_review/
    README.md
    docs/
      evidence_checklist.md
      ui_api_db_log_evidence.md
      design_review_findings.md
      residual_risk.md
```

## 4. 全体フロー

```text
review target select -> checklist -> evidence collect -> design compare -> finding -> fix candidate -> residual risk
```

## 5. コンポーネント

| コンポーネント | 役割 |
|---|---|
| evidence checklist | UI、API、DB、ログ、healthの確認観点 |
| Playwright evidence | UI操作、trace、screenshot |
| curl evidence | API request / response |
| DB/log evidence | 状態変化、request id、Docker logs |
| review findings | 一致、不一致、影響、対処候補、残リスク |

## 6. 処理方針

1. レビュー対象システムと設計書を選ぶ
2. 確認観点チェックリストを作る
3. UI、API、DB、ログ、healthの証拠を集める
4. 設計書の記述と証拠を対応付ける
5. 不一致をfinding、impact、fix candidateに分ける
6. 対処済み、未対処、残リスクを記録する

## 7. 確認観点

- UI、API、DB、ログ、healthの証拠を組み合わせられるか
- 設計書と実行証拠の差分を説明できるか
- 指摘事項、対処、残課題を分けて記録できるか

## 8. 後続工程への引き継ぎ

詳細設計に進む場合は、先に `StudyArchitecture arch02` を正規ルートとして扱うか再確認する。

