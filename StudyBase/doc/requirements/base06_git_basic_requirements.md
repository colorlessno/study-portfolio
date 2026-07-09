# base06 Git基本操作 要件定義

## 1. 目的

Git の基本操作を、AI 生成物の差分確認、学習記録、作業復元に使えるようにする。

## 2. 学習対象

- `git status`
- `git add`
- `git commit`
- `git diff`
- `git log`
- `.gitignore`
- 作業前後の差分確認

## 3. 作成する成果物

- Git練習用の小さなリポジトリ
- 操作手順書
- 差分確認メモ
- `.gitignore` 例
- よくある失敗と対処メモ

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | ファイル追加、変更、削除を Git で確認できる |
| FR-02 | `git status` で作業状態を確認できる |
| FR-03 | `git diff` で変更内容を確認できる |
| FR-04 | `git add` と `git commit` で履歴を残せる |
| FR-05 | `git log` で履歴を確認できる |
| FR-06 | `.gitignore` で不要ファイルを除外できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | Windows PowerShell で実行できる |
| NFR-02 | Git Bash でも読み替え可能な説明にする |
| NFR-03 | 既存 Study フォルダを壊さない練習用構成にする |

## 6. 対象外

- GitHub連携
- branch / merge
- conflict解消
- CI/CD

## 7. 受入条件

- 作業前後に `git status` と `git diff` を確認できる
- 意図したファイルだけを commit できる
- `.gitignore` の効果を説明できる
- AI が変更した内容を差分として読める

## 8. 学習観点

- Git は保存ボタンではなく変更履歴管理である
- commit 前に差分を読む
- 不要ファイルを履歴に入れない
