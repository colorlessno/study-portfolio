# arch02 証拠ベース設計レビュー

## 目的

設計上の指摘を具体的な証拠に対応づけてレビューする力を身につける。

この単元は evidence-driven design review 系の正規ルートである。`StudyDevOps devops10` は重複候補として残すが、実装はここから始める。

## 学習順

1. `docs/review_target.md` でreview対象を決める。
2. `docs/evidence_checklist.md` で証拠を集める。
3. `docs/evidence_mapping.md` で主張とsourceを対応づける。
4. `docs/findings.md` に指摘を書く。
5. `docs/residual_risk.md` に残リスクを記録する。
6. `docs/review_result_template.md` で短い最終reviewを書く。
7. `docs/example_devops07_design_review.md` の記入例と比較する。

## 完了条件

- 指摘はimpactから書く。
- 各指摘にsourceがある。
- assumptionとconfirmed factを分ける。
- 最終reviewにtest gapまたは残リスクを含める。
