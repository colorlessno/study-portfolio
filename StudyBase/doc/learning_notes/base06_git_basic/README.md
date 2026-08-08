# base06 Git基本操作

Gitを保存ボタンとして使うのではなく、`status`、`diff`、stage、commit、logから変更の意味を確認します。教材原本の中では`git init`しません。

## 到達目標

- working tree、staging area、commitを区別できる。
- `status`と`diff`からcommit対象を説明できる。
- 1つのcommitへ含める変更範囲を判断できる。

## 教材

- [練習原本](../../../src/samples/base06_git_basic/practice_repo/)
- [コマンド記録](notes/git_command_log.md) / [diff読解](notes/diff_reading_note.md) / [エラー](notes/common_errors.md)
- [要件定義](../../requirements/base06_git_basic_requirements.md) / [基本設計](../../basic_design/base06_basic_design.md) / [詳細設計](../../detailed_design/base06_detailed_design.md)

## 始める前の問い

- `git add`で履歴は確定するか。
- `git diff`と`git diff --staged`は何を見るか。
- 無関係な変更を同じcommitへ入れると何が困るか。

## 15分で安全に再開

```powershell
node StudyBase\scripts\validate-studybase.mjs base06
```

検証器は練習原本をOSの一時領域へコピーし、`init`、初回commit、ファイル変更、`status`、`diff`を確認して削除します。実リポジトリや教材原本へ入れ子の`.git`を作りません。

## 完了条件

変更前、未stage、stage済み、commit済みの各状態をコマンド出力から説明できれば完了です。
