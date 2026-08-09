# base07 branch / merge / conflict 要件定義

## 1. 目的

branch を使った並行作業、merge、conflict解消を練習し、チーム開発や AI 生成物の取り込みで起きる衝突を怖がらず扱えるようにする。

## 2. 学習対象

- branch 作成と切り替え
- branch 上での commit
- merge
- conflict の発生条件
- conflict marker の読み方
- 解消後の確認

## 3. 作成する成果物

- branch練習用リポジトリ
- conflict再現手順
- conflict解消手順
- 解消前後の差分メモ
- よくある失敗と対処メモ

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | branch を作成し、切り替えられる |
| FR-02 | 複数 branch で別々の変更を commit できる |
| FR-03 | merge で変更を統合できる |
| FR-04 | 同一行変更による conflict を再現できる |
| FR-05 | conflict marker を読んで修正できる |
| FR-06 | 解消後にテキスト内容と Git 状態を確認できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | 練習は小さいテキストファイルで完結する |
| NFR-02 | 既存 Study フォルダの履歴を壊さない |
| NFR-03 | conflict を作る手順と直す手順を分離して説明する |

## 6. 対象外

- Pull Request
- GitHub上のレビュー
- rebase の深掘り
- 複雑な履歴修正

## 7. 受入条件

- branch の作成、切り替え、merge を説明できる
- conflict を意図的に再現できる
- conflict marker を削除し、正しい内容に直せる
- 解消後に `git status` が clean になる流れを確認できる

## 8. 学習観点

- conflict は異常ではなく並行作業の結果である
- 解消時は両方の意図を読む
- 解消後は必ず差分と動作を確認する
