# web36 localStorage注意点

ブラウザの `localStorage` に非機密のメモを保存・読取・削除し、保存期間とセキュリティ上の注意点を確認する静的サンプル。

## このテーマで身につけること

- `localStorage` の値を同じ origin のブラウザが保持する仕組みを説明する
- 保存、読取、削除を DevTools と JavaScript の両方から確認する
- `localStorage` と `sessionStorage` の寿命の違いを説明する
- 保存してよい情報と、token・個人情報のように避ける情報を区別する

## 10分で再開する

再現性のある HTTP origin で確認するため、Docker を使う方法を推奨する。

```powershell
cd StudyWeb\src\frontend\static\studyweb\systems\web36_localstorage_notes
docker build -t studyweb-web36 .
docker run --rm -p 3036:80 studyweb-web36
```

`http://localhost:3036/app/` を開く。終了は `Ctrl+C`。

簡単に確認するだけなら `app/index.html` をブラウザで直接開くこともできる。ただし `file:` URL の保存領域の扱いはブラウザごとの差が出やすいため、学習結果を比較するときは HTTP で開く。

## 最初に試す順番

1. DevTools の Application タブを開き、Local Storage の `http://localhost:3036` を選ぶ
2. 入力欄に機密情報ではないテスト文字列を入れて `save` を押す
3. `studyweb.web36.memo` が追加されたことを確認する
4. ページを再読み込みしてから `load` を押し、値が残っていることを確認する
5. `clear` を押し、対象の key だけが削除されることを確認する

短い手順は [Storage確認](docs/storage_check.md)、保存可否の例は [保存可否](docs/storage_risk_table.md) にまとめている。

## コードを読む順番

1. `app/index.html` で、入力欄と3つのボタンの id を確認する
2. `app/src/main.js` の `key` で、このアプリ専用の名前を付けている理由を考える
3. `localStorage.setItem`、`getItem`、`removeItem` を操作と対応付ける
4. `getItem` が値を返さないときの `(empty)` 表示を見る
5. `Dockerfile` で、静的ファイルを Nginx から配信する構成を確認する

## 観察ポイント

- `localStorage` はページを再読み込みしても、同じ origin なら値が残る
- key と value は文字列として保存される。オブジェクトを扱うなら JSON への変換が必要になる
- ブラウザの利用者は DevTools から値を閲覧・変更・削除できる
- `HttpOnly` Cookie と違い、同じ origin で動く JavaScript から読み取れる
- そのため XSS が起きると、保存した token などを盗まれる可能性がある

このサンプルには本物の token、password、氏名、メールアドレスなどを入力しない。動作確認には架空の値だけを使う。

## 壊して確かめる

- key を `studyweb.web36.memo.v2` に変え、古い key の値とは別に保存されることを確認する
- `localStorage` を `sessionStorage` に置き換え、タブを閉じた後の違いを確認する
- `setItem(key, value.value)` を `setItem(key, JSON.stringify({ memo: value.value }))` に変え、保存文字列と読取処理を観察する
- DevTools から値を直接変更し、画面の `load` がその変更を信頼して表示することを確認する

最後の項目から、ブラウザ保存値をサーバー側の権限判定や信頼できる入力として扱ってはいけない理由を考える。

## 自分の言葉で説明する

- `localStorage` の値は、どこに、どの単位で、いつまで残るか
- `localStorage` と Session、Cookie は何が違うか
- UI 設定は保存できても、access token や個人情報を避けるのはなぜか
- XSS とブラウザ保存領域にはどんな関係があるか

## 完了条件

- 保存、再読み込み後の読取、削除を DevTools と画面の両方で確認した
- `localStorage` と `sessionStorage` の寿命の違いを実験した
- [保存可否](docs/storage_risk_table.md) に自分の例を追加できる
- このサンプルに実データを保存してはいけない理由を説明できる
