# base08 Issue -> branch -> PR -> merge 詳細設計
## 0. 関連文書

- `../requirements/base08_issue_branch_pr_merge_requirements.md`
- `../basic_design/base08_basic_design.md`

## 1. 製造対象

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
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `issue_template.md` | 背景、目的、作業内容、完了条件、対象外 |
| `pull_request_template.md` | 概要、変更内容、確認結果、未確認事項、関連Issue |
| `review_response_note.md` | 指摘、原因、対処、横展開確認、再確認結果 |

## 3. サンプル設計
`sample_issue.md` は README の説明不足修正を題材にする。`sample_pull_request.md` は変更内容と確認結果を短く書く。`sample_review_response.md` は「同じ説明不足が他ファイルにもないか確認する」横展開例を含める。
## 4. 確認手順
1. Issue に完了条件があることを確認する
2. PR に変更内容と確認結果があることを確認する
3. review 指摘への対処が記録されていることを確認する
4. 横展開確認範囲が書かれていることを確認する
## 5. 完了条件

- テンプレート3本とサンプル3本がある
- Issue、PR、review response の流れが追える
- 指摘対応が一点修正で終わっていない
