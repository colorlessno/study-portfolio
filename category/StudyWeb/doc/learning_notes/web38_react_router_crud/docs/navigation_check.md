# Navigation Check

| 操作 | 確認するURL | 期待する画面 |
|---|---|---|
| 初期表示 | `#/items` | 一覧 |
| Alphaを選択 | `#/items/1` | 詳細 Alpha |
| Betaを編集 | `#/items/2/edit` | 編集 Beta |
| 新規を選択 | `#/items/new` | 新規作成placeholder |
| 存在しないID | `#/items/999` | not found |
| 不正なhash | `#/missing` | not found |

一通り遷移した後、ブラウザの戻る・進むでURLと画面が同じ履歴をたどることも確認する。

現在の新規・編集は操作可能なCRUDフォームではない。routeの確認後、どちらかを実装して画面遷移だけのサンプルから発展させる。
