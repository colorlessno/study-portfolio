# base06 Git基本操作 詳細設計
## 0. 関連文書

- `../requirements/base06_git_basic_requirements.md`
- `../basic_design/base06_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base06_git_basic/
  README.md
  notes/
src/samples/base06_git_basic/
  practice_repo/
```
## 2. ファイル設計
| ファイル | 内容 |
|---|---|
| `practice_repo/README.md` | 練習用リポジトリの説明 |
| `practice_repo/notes.txt` | 追加、変更、削除を試すテキスト |
| `practice_repo/ignored.log` | `.gitignore` で除外する例 |
| `practice_repo/.gitignore` | `*.log` を除外 |
| `notes/git_command_log.md` | 実行コマンドと結果 |
| `notes/diff_reading_note.md` | 差分読解メモ |
| `notes/common_errors.md` | よくある失敗と対処 |

## 3. 操作設計
1. `practice_repo` で `git init`
2. `git status` で状態確認
3. `notes.txt` を変更
4. `git diff` で差分確認
5. `git add` と `git commit`
6. `ignored.log` が除外されることを確認
7. `git log --oneline` で履歴確認
## 4. 確認手順
- commit 前に `git diff` を確認する
- commit 対象に `ignored.log` が含まれないことを確認する
- `git log --oneline` に履歴があることを確認する
## 5. 完了条件

- 練習用ファイルと学習メモがある
- 基本コマンドの実行順序が分かる
- 不要ファイルを履歴に入れない確認ができる
