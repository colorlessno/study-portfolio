# base08 Issue -> branch -> PR -> merge 要件定義

## 1. 目的

現代開発の基本フローである Issue、branch、Pull Request、review、merge の流れを小さく再現し、作業単位と履歴を管理できるようにする。

## 2. 学習対象

- Issue の作成
- branch 名と作業目的の対応
- Pull Request の説明
- review 指摘と修正 commit
- merge 後の確認
- 作業記録の残し方

## 3. 作成する成果物

- Issue テンプレート
- Pull Request テンプレート
- 練習用リポジトリ
- review 指摘対応メモ
- merge 完了確認メモ

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | Issue に目的、作業内容、完了条件を記録できる |
| FR-02 | Issue に対応する branch を作成できる |
| FR-03 | Pull Request に変更内容、確認内容、未確認事項を記録できる |
| FR-04 | review 指摘を修正 commit として反映できる |
| FR-05 | merge 後に作業完了状態を確認できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | GitHub を使う場合と、ローカルだけで疑似的に行う場合の両方を想定する |
| NFR-02 | PR本文は短くても、目的、変更点、確認結果を含める |
| NFR-03 | 指摘対応は同種問題の横展開確認を含める |

## 6. 対象外

- GitHub Projects の本格運用
- 複雑な protected branch 設定
- 自動デプロイ
- 大規模チーム運用

## 7. 受入条件

- Issue から branch、PR、review、merge までの流れを説明できる
- PR に目的、変更内容、確認結果、残課題を書ける
- review 指摘に対して修正内容と横展開確認範囲を記録できる
- merge 後の確認観点を説明できる

## 8. 学習観点

- 作業は Issue 単位に分ける
- PR は差分を説明する成果物である
- 指摘対応は一点修正ではなく横展開する
