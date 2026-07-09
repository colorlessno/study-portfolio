# StudyBase

`StudyBase` は、他の `StudyXX` に進む前の共通基礎を扱う学習分野です。
対象:

- 要求分析
- 防御的ドキュメント
- Git / branch / PR
- npm scripts
- curl API確認

## 構成

StudyAI 型に合わせて、番号フォルダをトップレベルに置かず、共通領域へ分けています。

| 領域 | 内容 |
|---|---|
| `src/samples/` | 練習用サンプル、実行可能な小さいプロジェクト |
| `doc/templates/` | 記述用テンプレート |
| `doc/learning_notes/` | 各テーマの README、学習メモ、コマンド例 |
| `doc/requirements/` | 要件定義 |
| `doc/basic_design/` | 基本設計 |
| `doc/detailed_design/` | 詳細設計 |
| `doc/reviews/` | 自己レビュー |

## テーマ一覧

| No | テーマ | サンプル | 学習メモ |
|---|---|---|---|
| base01 | 曖昧依頼ヒアリング | `src/samples/base01_ambiguous_request_hearing/` | `doc/learning_notes/base01_ambiguous_request_hearing/` |
| base02 | 情報不足時の暫定成果物 | `src/samples/base02_incomplete_information_deliverable/` | `doc/learning_notes/base02_incomplete_information_deliverable/` |
| base03 | 見積もり根拠表 | `src/samples/base03_estimate_basis/` | `doc/learning_notes/base03_estimate_basis/` |
| base04 | テスト成立条件チェックリスト | `src/samples/base04_test_precondition_checklist/` | `doc/learning_notes/base04_test_precondition_checklist/` |
| base05 | RACI / 責任分担表 | `src/samples/base05_raci_responsibility_matrix/` | `doc/learning_notes/base05_raci_responsibility_matrix/` |
| base06 | Git基本操作 | `src/samples/base06_git_basic/` | `doc/learning_notes/base06_git_basic/` |
| base07 | branch / merge / conflict | `src/samples/base07_branch_merge_conflict/` | `doc/learning_notes/base07_branch_merge_conflict/` |
| base08 | Issue -> branch -> PR -> merge | `src/samples/base08_issue_branch_pr_merge/` | `doc/learning_notes/base08_issue_branch_pr_merge/` |
| base09 | npm scripts | `src/samples/base09_npm_scripts/` | `doc/learning_notes/base09_npm_scripts/` |
| base10 | curl API確認 | `src/samples/base10_curl_api_check/` | `doc/learning_notes/base10_curl_api_check/` |

## 学習の進め方

1. `doc/requirements/` で要件定義を読む
2. `doc/basic_design/` で基本設計を読む
3. `doc/detailed_design/` で詳細設計を読む
4. `doc/learning_notes/baseXX_*/README.md` で手順を確認する
5. `src/samples/baseXX_*/` や `doc/templates/baseXX_*/` を使って練習する
6. 実行できるものは npm または Docker で確認し、結果を学習メモに残す
## 文書完結型テーマについて

`base01`〜`base05`、`base08`、`base11` は、詳細設計の製造対象を**コードではなく文書**（テンプレート・記入例・デモ台本など）として定義した文書完結型テーマです。コード実体があるのは `base06` / `base07`（Git 練習リポジトリ）と `base09` / `base10`（Node サンプル）です。なお `base12` は正規ルートを `StudyArchitecture arch01` とする重複テーマのため、教材成果物は意図的に作成していません。
