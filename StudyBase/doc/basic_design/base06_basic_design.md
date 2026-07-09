# base06 Git基本操作 基本設計
## 0. 関連要件

- `../requirements/base06_git_basic_requirements.md`

## 1. 設計目的
Git の基本操作を、差分確認と学習記録に使えるようにする練習サンプルを設計する。
## 2. 対象範囲

- 練習用リポジトリの作成
- ファイル追加、変更、削除
- `status`、`diff`、`add`、`commit`、`log`
- `.gitignore`
- 操作ログの記録

## 3. 成果物構成

```text
doc/learning_notes/base06_git_basic/
  README.md
  notes/
src/samples/base06_git_basic/
  practice_repo/
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 練習ファイル | 追加、変更、削除する小さなテキスト |
| Gitコマンド | 学習対象の基本コマンド |
| 除外対象 | `.gitignore` に入れるファイル |

## 5. 出力
| 出力 | 内容 |
|---|---|
| Git履歴 | commit と log |
| 差分メモ | `git diff` の読解結果 |
| 操作ログ | 実行したコマンドと結果 |

## 6. 処理方針
1. 練習用リポジトリを作る
2. ファイルを追加、変更、削除する
3. `status` と `diff` で状態を見る
4. 必要なファイルだけ `add` する
5. `commit` して `log` を確認する
6. `.gitignore` の効果を確認する

## 7. 確認観点

- commit 前に差分を確認しているか
- 不要ファイルが履歴に入っていないか
- 操作ログにコマンドと結果が残っているか
## 8. 後続工程への引き継ぎ

詳細設計では、練習手順、ファイル内容、期待するGit 状態、確認コマンドを定義する。
