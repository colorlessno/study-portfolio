# web02_browser_network

ブラウザが HTML / CSS / JavaScript / 画像を読み込む流れを DevTools の Network タブで確認するサンプルです。

## 起動方法

`index.html` をブラウザで開きます。

簡易HTTPサーバーで確認する場合は、このフォルダで次のコマンドを実行します。

```bash
python -m http.server 8002
```

その後、ブラウザで `http://localhost:8002` を開きます。

## DevTools の開き方

Chrome / Edge では `F12` または右クリックの「検証」から DevTools を開き、Network タブを選びます。
必要に応じて `Disable cache` を有効にしてからページを再読み込みします。

## Network タブで見るもの

| ファイル | Typeの目安 |
|---|---|
| `index.html` | document |
| `styles/style.css` | stylesheet |
| `scripts/main.js` | script |
| `images/profile-placeholder.svg` | image |
| `images/favicon.svg` | image |

## 確認ポイント

- Status が 200 になっているか
- Type が document / stylesheet / script / image と分かれているか
- Size と Time が表示されているか
- CSS が反映されているか
- ボタンを押して JavaScript のメッセージが変わるか
- 画像が表示されているか
- `favicon.ico` の404が出ず、`images/favicon.svg` が読み込まれているか

## うまく表示されないとき

Network タブで 404 が出ているファイルのパスを確認してください。

`[Smart Unit Converter]` のようなログはブラウザ拡張機能のContent Scriptによるもので、このサンプルのJavaScriptではありません。拡張機能由来か確認したい場合は、シークレットウィンドウや拡張機能を無効にした状態で再確認します。
