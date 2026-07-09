# base02 情報不足時の暫定成果物 詳細設計
## 0. 関連文書

- `../requirements/base02_incomplete_information_deliverable_requirements.md`
- `../basic_design/base02_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base02_incomplete_information_deliverable/
  README.md
doc/templates/base02_incomplete_information_deliverable/
  assumption_list.md
  deliverable_limitation_note.md
  provisional_deliverable.md
  unknown_issues_list.md
src/samples/base02_incomplete_information_deliverable/
  incomplete_case.md
  completed_provisional_deliverable.md
```
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `provisional_deliverable.md` | 目的、対象範囲、書ける範囲、書けない範囲、暫定内容、確認待ち |
| `assumption_list.md` | ID、仮定、根拠、影響、確認先、状態 |
| `unknown_issues_list.md` | ID、不明点、確認内容、確認先、期限、未解決時の影響 |
| `deliverable_limitation_note.md` | 成果物の限界、使ってよい範囲、使ってはいけない範囲、レビュー観点 |

## 3. サンプル設計
`incomplete_case.md` は、既存画面の仕様書作成を依頼されたが、画面仕様、DB仕様、確認先が不足しているケースにする。
`completed_provisional_deliverable.md` は、完成仕様書ではなく、前提付きの暫定成果物として記述する。
## 4. 確認手順
1. 書ける範囲と書けない範囲が分離されていることを確認する
2. 仮定に根拠と影響があることを確認する
3. 未確定事項に確認先と期限があることを確認する
4. 成果物限界メモが添付されていることを確認する
## 5. 完了条件

- テンプレート4本とサンプル2本がある
- 不明点を断定していない
- 暫定成果物として利用範囲が明記されている
