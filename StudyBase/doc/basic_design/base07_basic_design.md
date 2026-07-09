# base07 branch / merge / conflict 基本設計
## 0. 関連要件

- `../requirements/base07_branch_merge_conflict_requirements.md`

## 1. 設計目的
branch、merge、conflict解消を小さいテキスト変更で再現する練習サンプルを設計する。
## 2. 対象範囲

- branch 作成と切り替え
- branch ごとの commit
- merge
- conflict の再現
- conflict 解消と確認

## 3. 成果物構成

```text
doc/learning_notes/base07_branch_merge_conflict/
  README.md
  notes/
src/samples/base07_branch_merge_conflict/
  practice_repo/
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 練習ファイル | conflict を起こす小さなテキスト |
| branch 名 | 作業目的で分けるbranch |
| 変更内容 | 同一行と別行の変更パターン |

## 5. 出力
| 出力 | 内容 |
|---|---|
| branch 操作ログ | 作成、切替、commit、merge の記録 |
| conflict 再現メモ | 発生条件とエラーメッセージ |
| conflict 解消メモ | 解消方針と確認結果 |

## 6. 処理方針
1. 練習用リポジトリを用意する
2. branch を2つ作る
3. 同一ファイルの同一行を別々に変更する
4. merge して conflict を発生させる
5. conflict marker を読んで解消する
6. 解消後の差分や状態を確認する

## 7. 確認観点

- conflict 発生条件を説明できるか
- 両方の変更意図を読んでいるか
- 解消後に `status` と内容を確認しているか
## 8. 後続工程への引き継ぎ

詳細設計では、branch 名、変更対象行、conflict 解消後の正解例、確認コマンドを定義する。
