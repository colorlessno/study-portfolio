# base08 Issue -> branch -> push -> PR -> merge -> sync 詳細設計
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
  gitea_lab/
    README.md
    docker-compose.yml
    review_scenario.md
    seed_repository/
      README.md
      docs/team-workflow.md
      scripts/check-workflow.mjs
```
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `issue_template.md` | 背景、目的、作業内容、完了条件、対象外 |
| `pull_request_template.md` | 概要、変更内容、確認結果、未確認事項、関連Issue |
| `review_response_note.md` | 指摘、原因、対処、横展開確認、再確認結果 |

## 3. サンプル設計
`sample_issue.md` は README の説明不足修正を題材にする。`sample_pull_request.md` は変更内容と確認結果を短く書く。`sample_review_response.md` は「同じ説明不足が他ファイルにもないか確認する」横展開例を含める。
## 4. Gitea演習設計

- Docker ComposeでGiteaとSQLiteを単一コンテナに閉じ、Web UIは`127.0.0.1:3418`だけへ公開する。
- 必須編は1アカウントで役割を読み替え、発展編は開発担当とreview担当の2アカウントで実施する。
- 初回push後にmain保護を設定し、以後は作業branchからPull Requestを作る。
- seed repositoryの検証scriptをPR作成前に実行し、結果をPR本文へ記録する。
- review担当は用意された指摘を出し、開発担当は修正commitを同じbranchへpushする。
- merge後はサーバー側mainが更新済みであるため、ローカルでは再mergeせず`pull --ff-only`で同期する。
- `docker compose down`はデータを残し、`docker compose down --volumes`は演習用named volumeも削除する。

## 5. 確認手順

1. Issue に完了条件があることを確認する
2. 作業branchがremoteへpushされていることを確認する
3. PR に変更内容と確認結果があることを確認する
4. review 指摘への対処が追加commitとして記録されていることを確認する
5. 横展開確認範囲が書かれていることを確認する
6. 承認後にmainへmergeされたことを確認する
7. ローカルmainと`origin/main`が同じcommitを指すことを確認する

## 6. 完了条件

- テンプレート3本とサンプル3本がある
- Gitea演習環境、seed repository、reviewシナリオがある
- Issue、branch、push、PR、review、merge、ローカル同期の流れが追える
- 指摘対応が一点修正で終わっていない
- mainへの直接pushを避け、review担当による承認を体験できる
