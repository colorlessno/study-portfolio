# base05 RACI / 責任分担表 詳細設計
## 0. 関連文書

- `../requirements/base05_raci_responsibility_matrix_requirements.md`
- `../basic_design/base05_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base05_raci_responsibility_matrix/
  README.md
doc/templates/base05_raci_responsibility_matrix/
  decision_pending_list.md
  escalation_note.md
  raci_matrix.md
src/samples/base05_raci_responsibility_matrix/
  responsibility_case.md
  completed_raci_matrix.md
```
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `raci_matrix.md` | 作業、Responsible、Accountable、Consulted、Informed、備考 |
| `escalation_note.md` | 決められない事項、理由、影響、依頼先、期限 |
| `decision_pending_list.md` | 判断待ちID、内容、決定者、期限、未決時の影響 |

## 3. サンプル設計
`responsibility_case.md` は、既存システム調査と改修方針決定を題材にする。担当者が実施できる作業と、承認者判断が必要な作業を混ぜる。
`completed_raci_matrix.md` は、実施責任と説明責任を分けて記述する。
## 4. 確認手順
1. 各作業に Responsible と Accountable があることを確認する
2. 判断待ち事項が別表になっていることを確認する
3. 自分で決めてはいけない事項がエスカレーションされていることを確認する
4. 共有先が明記されていることを確認する
## 5. 完了条件

- テンプレート3本とサンプル2本がある
- 決定者不在の事項が放置されていない
- 責任追及ではなく作業分担の明確化になっている
