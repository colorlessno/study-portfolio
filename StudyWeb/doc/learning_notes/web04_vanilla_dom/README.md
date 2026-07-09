# web04_vanilla_dom

素の JavaScript で DOM を操作するサンプルです。

## 起動方法

`index.html` をブラウザで開きます。

## 確認ポイント

- `document.getElementById` で要素を取得している
- `addEventListener` でクリックイベントを登録している
- `textContent` で画面表示を変更している
- HTMLに `onclick` を直接書いていない

## うまく動かないとき

Console に `web04: required element was not found.` が出た場合は、HTML側の `id` を確認してください。
