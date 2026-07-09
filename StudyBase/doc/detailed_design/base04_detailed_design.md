# base04 テスト成立条件チェック 詳細設計
## 0. 関連文書

- `../requirements/base04_test_precondition_checklist_requirements.md`
- `../basic_design/base04_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base04_test_precondition_checklist/
  README.md
doc/templates/base04_test_precondition_checklist/
  test_data_check.md
  test_environment_check.md
  test_precondition_checklist.md
src/samples/base04_test_precondition_checklist/
  test_precondition_case.md
  completed_test_precondition_checklist.md
```
## 2. テンプレート設計
| ファイル | 主な項目 |
|---|---|
| `test_precondition_checklist.md` | テスト対象、環境、権限、データ、手順、期待結果、判定基準 |
| `test_environment_check.md` | URL、DB、外部連携、アカウント、ログ確認先 |
| `test_data_check.md` | データID、作成方法、初期状態、期待状態、後片付け |

## 3. サンプル設計
`test_precondition_case.md` は、ログイン付き画面の結合テストを題材にする。アカウント未準備、テストデータ不足、外部連携未接続を含める。
`completed_test_precondition_checklist.md` は、実施可能、保留、代替確認を分けて記録する。
## 4. 確認手順
1. テスト対象が具体化されていることを確認する
2. 環境、データ、権限が揃っているか確認する
3. 判定基準があることを確認する
4. 未充足条件に代替案があることを確認する
## 5. 完了条件

- テンプレート3本とサンプル2本がある
- テストできない理由が条件不足として整理されている
- 後続の自動テスト設計へ接続できる
