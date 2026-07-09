# web40 テーブル検索・ページング 詳細設計
## 0. 関連文書

- `../requirements/web40_table_search_pagination_requirements.md`
- `../basic_design/web40_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web40_table_search_pagination/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web40_table_search_pagination/
  README.md
  docs/table_state.md
  docs/operation_check.md
```

## 2. 主要設計
| 機能 | 内容|
|---|---|
| 検索 | keywordでfilter |
| ソーテ| name/status/date |
| ページング | page size固定|
| 状態| loading / empty / error / success |

## 3. 確認手順
1. 初期一覧を確認する2. keyword検索を行う
3. 各でソートする4. ページを切り替える
5. empty/error状態を確認する
## 4. 完了条件

- 検索・ソーのページングを組み合わせられる
- empty/error/loadingが区別される
- 長い行で崩れにくい

