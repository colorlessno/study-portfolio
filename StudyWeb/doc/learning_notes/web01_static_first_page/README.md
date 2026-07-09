# web01_static_first_page

HTML / CSS / JavaScript の役割分担を確認するための、最小の自己紹介ページです。
## 目的
- HTML がページ構造を担当することを確認する
- CSS が見た目を担当することを確認する
- JavaScript がユーザー操作による表示変更を担当することを確認する
## ファイル構成

```text
src/frontend/src/studyweb/systems/web01_static_first_page/
  index.html
  styles.css
  script.js
  README.md
```

## 起動方法
`index.html` をブラウザで開きます。
`file://` で直接開いた場合、ブラウザや拡張機能によっては Console に `file:` URL のセキュリティ警告が出ることがあります。ページ表示とボタン操作が動いていれば、このサンプルの JavaScript エラーではありません。
## 確認ポイント
1. `index.html` に見出し、自己紹介文、リスト、ボタンがある
2. `styles.css` によって余白、背景色、カード風の見た目が反映されている
3. `script.js` によって、ボタンを押すとメッセージとクリック回数が変わる
## うまく動かないとき
- 見た目が反映されない場合は、`index.html` の `<link>` のパスを確認する
- ボタンを押しても変わらない場合は、`<script src="./script.js" defer>` を確認する
- DevTools の Console に `web01: required element was not found.` があったら、HTML の `id` を確認する
