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

## 2. データ

| 項目 | 型 | 内容 |
|---|---|---|
| `id` | number | 1〜17 |
| `name` | string | `Item A0`等の表示名 |
| `status` | string | `open` / `closed` |

データはJavaScriptで生成し、API・DBは使用しない。

## 3. 画面状態

| 状態 | 内容 |
|---|---|
| `q.value` | name検索に使うkeyword |
| `page` | 0始まりの現在ページ |
| `asc` | nameの昇順・降順 |
| `size` | 1ページ5件で固定 |

## 4. 一覧計算

1. keywordを小文字へ変換する。
2. nameを部分一致でfilterする。
3. `asc` に従いnameでsortする。
4. `page * size` から5件をsliceする。
5. 全体件数と1始まりのpage番号を表示する。
6. 1件以上ならtable row、0件ならempty rowを描画する。

## 5. 操作

| 操作 | 状態変更 |
|---|---|
| keyword入力 | `page = 0`、再描画 |
| sort | `asc` を反転、再描画 |
| prev | `page` を0未満にせず減らす |
| next | `page` を1増やす |

## 6. 要件との差分・既知の課題

- loading / error状態は未実装で、success / emptyだけを表示する。
- sort対象はnameだけで、status・date等は扱わない。
- nextに上限がなく、最終ページを越えて空のページへ進める。
- 総ページ数と表示範囲を示していない。
- table header、明示的label、buttonの無効状態、長文対策がない。
- ローカル17件を全件処理するサンプルで、サーバー側ページングではない。

## 7. 確認手順

1. 初期17件を5件単位で確認する。
2. keyword検索後にpage 1へ戻ることを確認する。
3. 昇順・降順を切り替える。
4. 一致しないkeywordでemptyを確認する。
5. 最終ページを越えられる問題を再現し、上限制御を追加する。
6. loading / errorを追加し、emptyと異なる表示にする。

## 8. 完了条件

- 検索、ソート、ページングを組み合わせられる。
- filter → sort → paginateの処理順を説明できる。
- loading / empty / error / successを区別できる。
- 範囲外ページを防ぎ、最初・最後のbutton状態を制御できる。
