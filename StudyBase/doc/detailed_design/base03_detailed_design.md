# base03 見積もり根拠表 詳細設計
## 0. 関連文書

- `../requirements/base03_estimate_basis_requirements.md`
- `../basic_design/base03_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base03_estimate_basis/
  README.md
doc/templates/base03_estimate_basis/
  estimate_basis.md
  risk_list.md
  work_breakdown.md
src/samples/base03_estimate_basis/
  estimate_case.md
  completed_estimate_basis.md
```
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `estimate_basis.md` | 見積もり対象、対象外、前提、合計、再見積もり条件 |
| `work_breakdown.md` | 作業ID、工程、作業内容、成果物、見積もり、根拠 |
| `risk_list.md` | リスク、発生条件、影響、対策、見積もり影響 |

## 3. サンプル設計
`estimate_case.md` は、小さな Web 画面修正を題材にする。調査、設計、実装、テスト、レビューを含める。
`completed_estimate_basis.md` は、単一の日数回答ではなく、対象外と再見積もり条件を明記する。
## 4. 確認手順
1. 対象範囲と対象外があることを確認する
2. 作業分解に成果物が紐づいていることを確認する
3. 見積もり値に根拠があることを確認する
4. 再見積もり条件があることを確認する
## 5. 完了条件

- テンプレート3本とサンプル2本がある
- 見積もり根拠が作業単位で説明されている
- 前提が崩れた場合の扱いが定義されている
