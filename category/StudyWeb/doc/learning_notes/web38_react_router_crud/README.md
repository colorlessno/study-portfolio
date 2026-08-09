# web38 React Router CRUD

依存パッケージを導入する前段として、URL の hash と画面状態を対応させた CRUD 導線を確認する。現在は React / React Router を使わず、素の JavaScript でルーティングの考え方だけを再現している。

## このテーマで身につけること

- URL、route、画面状態の対応を説明する
- 一覧、詳細、新規作成、編集、not found の導線を追う
- route parameter の文字列を ID として解釈する処理を読む
- ブラウザの戻る・進む操作と画面再描画の関係を理解する

## 10分で再開する

Docker で静的画面を配信する。

```powershell
cd category/StudyWeb\src\frontend\static\studyweb\systems\web38_react_router_crud
docker build -t studyweb-web38 .
docker run --rm -p 3038:80 studyweb-web38
```

`http://localhost:3038/app/` を開く。終了は `Ctrl+C`。

簡単な確認なら `app/index.html` を直接開ける。構文確認は次のコマンドで行う。

```powershell
node --check app/src/main.js
```

## 最初に試す順番

1. 一覧から `Alpha` の詳細を開き、URL が `#/items/1` になることを見る
2. 一覧へ戻り、`Beta` の編集を開いて `#/items/2/edit` を確認する
3. `新規` を押して `#/items/new` を確認する
4. URL を `#/items/999` に変更し、not found を確認する
5. ブラウザの戻る・進むを使い、URL に対応して画面が切り替わることを見る

route の対応は [Route Table](docs/route_table.md)、確認対象は [Navigation Check](docs/navigation_check.md) を参照する。

## コードを読む順番

1. `app/index.html` の navigation と、描画先の `main#app` を見る
2. `items` で、画面表示に使うローカルデータを確認する
3. `location.hash || '#/items'` で初期 route の決め方を見る
4. 一覧・新規の完全一致分岐を読む
5. 正規表現から ID と `/edit` を取り出す分岐を読む
6. `hashchange` event で、URL 変更後に再描画する仕組みを見る

## 現在のroute

| Hash | 画面 | 実装状態 |
|---|---|---|
| `#/items` | 一覧 | ローカル2件を表示 |
| `#/items/new` | 新規作成 | placeholderのみ |
| `#/items/:id` | 詳細 | 名前だけ表示 |
| `#/items/:id/edit` | 編集 | 名前だけ表示 |
| その他・存在しないID | not found | 見出しを表示 |

名称は React Router CRUD だが、現時点では React Router、作成・更新フォーム、保存、削除は未実装である。現在の成果は「CRUD画面のURL設計を最小コードで理解すること」に限定される。

## 観察ポイント

- hash より前の文書を再取得せず、同じページ内で画面を切り替えられる
- URL に ID があるため、詳細・編集画面を直接指定できる
- 数字形式でも `items` に存在しない ID は not found になる
- `#/items/new` を ID route より先に判定するため、`new` を数値 ID として扱わない
- ローカル配列なので、ページを再読み込みしても変更を保存する仕組みはない

## 壊して確かめる

- `items` に ID 3 を追加し、詳細・編集 route がコード変更なしで使えることを確認する
- `#/items/abc` と `#/missing` を開き、どちらの分岐で not found になるか説明する
- 詳細画面に一覧へ戻るリンクを追加する
- 新規作成フォームを実装し、配列へ追加した後に一覧へ遷移させる
- 同じ route table を React Router の route 定義へ置き換え、hash 手書き版との差を整理する

## 自分の言葉で説明する

- URL と画面状態を対応させる利点は何か
- route parameter を数値へ変換してから検索する理由は何か
- 不正なURLと、形式は正しいが存在しないIDをどう扱うか
- 現在の実装を「React Router CRUD完成版」と呼べない理由は何か

## 完了条件

- 一覧、詳細、新規、編集、not found の5画面を確認した
- 戻る・進む操作と `hashchange` の関係を説明できる
- route 判定の順番をコードから説明できる
- placeholder の作成または編集画面を1つ以上、操作可能な画面へ改造した
