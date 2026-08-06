# web40 テーブル検索・ページング

17件のローカルデータを使い、キーワード検索、名前順ソート、5件単位のページング、empty state を組み合わせて観察する。業務一覧画面で、操作のたびに一覧状態を一貫して計算する流れを学ぶ。

## このテーマで身につけること

- filter → sort → paginate の処理順を説明する
- 検索条件を変えたときにページ番号を戻す理由を理解する
- データが0件の empty state と、通信・処理の error state を区別する
- ページ範囲、ボタン状態、アクセシビリティ上の不足を発見して改善する

## 10分で再開する

Docker で静的画面を配信する。

```powershell
cd StudyWeb\src\frontend\static\studyweb\systems\web40_table_search_pagination
docker build -t studyweb-web40 .
docker run --rm -p 3040:80 studyweb-web40
```

`http://localhost:3040/app/` を開く。終了は `Ctrl+C`。

簡単な確認なら `app/index.html` を直接開ける。構文確認は次を使う。

```powershell
node --check app/src/main.js
```

## 最初に試す順番

1. 初期表示が17件、page 1、5行であることを確認する
2. `next` でページを進め、最終ページの行数を見る
3. `sort name` を押し、昇順・降順が切り替わることを確認する
4. 検索欄に `A` や `Item B` を入力し、件数と行が変わることを見る
5. 一致しない語を入力し、`データなし` を確認する
6. 検索条件を消し、page 1 に戻って一覧が復元されることを見る

一覧状態の分類は [Table State](docs/table_state.md)、操作の観点は [Operation Check](docs/operation_check.md) を参照する。

## コードを読む順番

1. `data` で17件のローカルデータが生成される規則を見る
2. `page` と `asc` で、画面をまたいで保持する状態を確認する
3. `render` 内の filter、sort、slice の順番を追う
4. 件数・ページ表示と、行 HTML の生成を確認する
5. 検索時だけ `page = 0` に戻す理由を考える
6. sort、prev、next の各 event handler が状態を変えて再描画する流れを見る

## 現実装で確認できる状態

| 状態・操作 | 実装状況 |
|---|---|
| success | ローカルデータを表形式で表示 |
| search | nameの部分一致、大文字小文字を区別しない |
| sort | nameの昇順・降順のみ |
| pagination | 5件単位、前へは0未満にならない |
| empty | 表内に `データなし` を表示 |
| loading / error | 未実装 |

要件にある loading / error、status・date 列のソート、長文対策は未実装である。また、`next` は最終ページを越えて進めるため、データが存在していても空のページを表示できてしまう。これらを改善課題として扱う。

## 観察ポイント

- 検索してから並べ替え、最後に現在ページの5件だけを切り出している
- 検索時に page を0へ戻さないと、絞込み後に存在しないページを表示する可能性がある
- empty は正常に0件だった状態であり、error とは意味が違う
- 現在の page 表示は総ページ数を示さず、範囲外ページも許してしまう
- table header、操作ラベル、button の無効状態など、業務UIとしての改善余地がある

## 壊して確かめる

- `next` を最終ページより先まで押し、17件あるのに `データなし` になる問題を再現する
- 総ページ数を計算し、最初・最後のページで prev / next を無効化する
- status の絞込みを追加し、keyword 検索と組み合わせる
- sort 後に page 1 へ戻す場合と戻さない場合を比較する
- loading と error を模擬する状態を追加し、empty と別の表示にする
- 長い name を追加し、折返し・省略・詳細表示のどれが適切か検討する

## 自分の言葉で説明する

- filter、sort、paginate の順番を変えると結果がどう変わるか
- empty と error は利用者へ何を伝える状態か
- 検索条件変更時にページ番号を初期化する理由は何か
- クライアント側ページングとサーバー側ページングをどう使い分けるか

## 完了条件

- 検索、ソート、ページング、empty を組み合わせて確認した
- 最終ページを越えられる問題を再現し、修正した
- loading / empty / error / success の違いを説明できる
- キーボード操作と読み上げを意識した改善点を2つ以上挙げられる
