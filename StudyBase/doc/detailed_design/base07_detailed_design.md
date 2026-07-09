# base07 branch / merge / conflict 詳細設計
## 0. 関連文書

- `../requirements/base07_branch_merge_conflict_requirements.md`
- `../basic_design/base07_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base07_branch_merge_conflict/
  README.md
  notes/
src/samples/base07_branch_merge_conflict/
  practice_repo/
```
## 2. ファイル設計
| ファイル | 内容 |
|---|---|
| `conflict_target.txt` | 同一行変更で conflict を起こす対象 |
| `branch_operation_log.md` | branch 作成、切替、merge のログ |
| `conflict_reproduction.md` | conflict 発生手順 |
| `conflict_resolution_note.md` | 解消方針、解消後の内容、確認結果 |

## 3. 操作設計
1. `main` に初期ファイルを commit
2. `feature/a` を作成して同一行を変更
3. `main` に戻り、同一行を別内容へ変更
4. `feature/a` を merge して conflict を発生させる
5. conflict marker を確認する
6. 両方の意図を踏まえて内容を修正する
7. 解消後に commit する

## 4. 確認手順
- conflict marker が発生することを確認する
- 解消後に marker が残っていないことを確認する
- `git status` が clean になることを確認する
- 解消理由がメモに残っていることを確認する
## 5. 完了条件

- conflict を再現できる
- 解消手順と判断理由が残っている
- 解消後の状態確認ができる
