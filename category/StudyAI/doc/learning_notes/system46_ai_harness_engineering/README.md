# system46 AI harness 設計

## 目的

AI作業を安定させるために、入力、検証、承認境界、feedback loopを設計する。

## 学習順

1. `docs/harness_contract.md` でharnessの契約を読む。
2. `fixtures/` で成功・失敗caseを比較する。
3. `checks/` のscriptを実行する。
4. `docs/approval_boundary.md` で人間承認が必要な境界を確認する。
5. `docs/run_log_template.md` と `docs/feedback_loop.md` を使って記録方法を確認する。
