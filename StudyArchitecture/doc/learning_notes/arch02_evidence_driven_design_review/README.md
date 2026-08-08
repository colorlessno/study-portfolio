# arch02 証拠ベース設計レビュー

## 目的

設計上の指摘を具体的な証拠に対応づけてレビューする力を身につける。

この単元は evidence-driven design review 系の正規ルートである。`StudyDevOps devops10` は重複候補として残すが、実装はここから始める。

## 15分で再開する

最初は`StudyDevOps devops07`のnegative readiness test不足を入力例として使います。

| 入力 | 値 |
|---|---|
| review対象 | `/health`、`/ready`、Docker healthcheck |
| 期待する設計 | livenessとreadinessが分離され、失敗時の挙動を確認できる |
| source | `app/server.js`、`docker-compose.yml`、`tests/health.test.js` |
| out of scope | production監視基盤、実DB、外部serviceのSLA |

1. `docs/example_devops07_design_review.md`の「指摘」を読む。
2. impact、evidence、recommendationの3要素を色分けするつもりで分離する。
3. source code上の503分岐と、自動testで確認済みの挙動を区別する。
4. `docs/review_result_template.md`へ、未実行checkを1つだけ書く。

## 学習順

1. `docs/review_target.md` でreview対象を決める。
2. `docs/evidence_checklist.md` で証拠を集める。
3. `docs/evidence_mapping.md` で主張とsourceを対応づける。
4. `docs/findings.md` に指摘を書く。
5. `docs/residual_risk.md` に残リスクを記録する。
6. `docs/review_result_template.md` で短い最終reviewを書く。
7. `docs/example_devops07_design_review.md` の記入例と比較する。

## 説明演習

- 「testがない」と「実装が誤っている」は、impactとevidenceがどう違うか。
- repository inspectionだけでconfidenceを高にできる主張と、runtime evidenceが必要な主張を分けられるか。
- severityを技術的な違和感ではなく、利用者・運用者へのimpactから説明できるか。
- recommendationを採用しても残るriskを、review結果へどう残すか。

## 完了条件

- 指摘はimpactから書く。
- 各指摘にsourceがある。
- assumptionとconfirmed factを分ける。
- 最終reviewにtest gapまたは残リスクを含める。
