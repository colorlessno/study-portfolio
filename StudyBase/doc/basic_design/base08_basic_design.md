# base08 Issue -> branch -> PR -> merge 基本設計
## 0. 関連要件

- `../requirements/base08_issue_branch_pr_merge_requirements.md`

## 1. 設計目的
Issue から branch、Pull Request、review、merge までの開発フローを小さく再現する学習サンプルを設計する。
## 2. 対象範囲

- Issue テンプレート
- branch 命名
- Pull Request テンプレート
- review 指摘と修正 commit
- merge 後確認

## 3. 成果物構成

```text
doc/learning_notes/base08_issue_branch_pr_merge/
  README.md
doc/templates/base08_issue_branch_pr_merge/
  issue_template.md
  pull_request_template.md
  review_response_note.md
src/samples/base08_issue_branch_pr_merge/
  sample_issue.md
  sample_pull_request.md
  sample_review_response.md
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 作業依頼 | Issue 化する小さい変更 |
| 変更ファイル | PR で差分するファイル |
| review 指摘 | 修正すべき観点 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| Issue | 目的、作業内容、完了条件 |
| Pull Request | 変更内容、確認結果、未確認事項 |
| 指摘対応メモ | 指摘、対処、横展開確認 |

## 6. 処理方針
1. 作業依頼を Issue にする
2. Issue に対応する branch を作る
3. 小さい変更を commit する
4. PR本文を作る
5. review 指摘を受けて修正する
6. 同種問題を横展開確認する
7. merge 後の確認結果を残す

## 7. 確認観点

- Issue と branch と PR の目的が対応しているか
- PR に確認結果があるか
- 指摘対応に横展開確認が含まれるか
## 8. 後続工程への引き継ぎ

詳細設計では、テンプレート項目、疑似レビューの内容、修正 commit の手順を定義する。
