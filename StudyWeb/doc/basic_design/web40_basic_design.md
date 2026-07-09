# web40 テーブル検索・ページング 基本設計
## 0. 関連要件

- `../requirements/web40_table_search_pagination_requirements.md`

## 1. 設計目的
業務一覧画面の検索、ソート、ページング、状態表示を学ぶサンプルを設計する。
## 2. 対象範囲

- table UI
- keyword search
- sort
- pagination
- loading / empty / error

## 3. 成果物構成

```text
src/frontend/static/studyweb/systems/web40_table_search_pagination/
  app/
  Dockerfile
doc/learning_notes/web40_table_search_pagination/
  README.md
  docs/
    table_state.md
    operation_check.md
```

## 4. 入力
| 入力| 内容|
|---|---|
| keyword | 検索文字列 |
| sort key | 並び替え |
| page | 表示ページ |

## 5. 出力
| 出力| 内容|
|---|---|
| table | 一覧表示 |
| state view | loading / empty / error |
| page info | 件数、ページ |

## 6. 処理手順
1. ローカルデータを用意する
2. keywordでfilterする
3. sort keyで並び替える
4. page sizeごとに表示する
5. empty や error 状態を切り替える

## 7. 確認観点

- 検索、ソート、ページングを組み合わせられる
- emptyをエラー扱いしていないか
- 長い行で崩れない

## 8. 後続工程への引き継ぎ

詳細設計では、データ項目、状態一覧、操作パターンを定義する。
