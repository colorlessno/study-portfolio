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

## 2. 主要設計
依存導入の最小版として hash route で画面遷移を再現する。React Router 本格版へ進む前に、URLと画面状態の対応を学ぶ。
| Path | 画面 |
|---|---|
| `/items` | 一覧 |
| `/items/new` | 新規成 |
| `/items/:id` | 詳細 |
| `/items/:id/edit` | 編集|
| `*` | not found |

## 3. 確認手順
1. 一覧から詳細へ遷移する
2. 新規成へ遷移する
3. 編集遷移する
4. 存在しないIDを開い5. 戻る・進むを確認する
## 4. 完了条件

- URLと画面が対応する
- CRUD導線が確認できる
- not foundが表示される
