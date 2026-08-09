# web38 React Router CRUD 詳細設計

## 0. 関連文書

- `../requirements/web38_react_router_crud_requirements.md`
- `../basic_design/web38_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web38_react_router_crud/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web38_react_router_crud/
  README.md
  docs/route_table.md
  docs/navigation_check.md
```

## 2. 現在の位置付け

現在は React / React Router を導入せず、`location.hash` と `hashchange` で画面遷移を再現する概念サンプルとする。URLと画面状態、route parameter、not foundを理解した後、同じroute tableをReact Routerへ置き換える。

## 3. Route

| Hash | 画面 | 現在の内容 |
|---|---|---|
| `#/items` | 一覧 | 2件の名前、詳細・編集リンク |
| `#/items/new` | 新規作成 | placeholder |
| `#/items/:id` | 詳細 | 対象の名前 |
| `#/items/:id/edit` | 編集 | 対象の名前 |
| その他 | not found | not found見出し |

## 4. ローカルデータ

```text
Item
  id: number
  name: string
```

初期データは ID 1の`Alpha`とID 2の`Beta`。永続化は行わない。

## 5. Route判定

1. hashがなければ `#/items` を初期値とする。
2. 一覧と新規作成を完全一致で判定する。
3. その他は正規表現で数値IDと任意の`/edit`を取り出す。
4. IDに一致するItemを検索する。
5. route不一致またはItem不存在ならnot foundを表示する。
6. `/edit` の有無により詳細・編集を切り替える。
7. `hashchange` ごとに同じ判定を再実行する。

## 6. 要件との差分

- React Routerは未導入で、hash routeを手書きしている。
- 新規・編集画面はplaceholderまたは見出しだけで、入力・保存できない。
- delete操作はない。
- ローカル配列は再読み込みで初期状態に戻る。

## 7. 確認手順

1. 一覧からID 1・2の詳細へ遷移する。
2. 新規作成と編集へ遷移する。
3. 存在しないIDと不正なhashでnot foundを確認する。
4. ブラウザの戻る・進むで画面がURLに追従することを確認する。
5. route tableを保ったまま、placeholderを操作可能な画面へ改造する。

## 8. 完了条件

- URLと表示画面が対応する。
- route parameterから対象Itemを検索できる。
- 不正routeと存在しないIDをnot foundとして扱える。
- 現在の概念版とReact Router本格版の差を説明できる。
