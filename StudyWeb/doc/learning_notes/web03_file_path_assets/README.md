# web03_file_path_assets

相対パスで CSS、JavaScript、画像を読み込む練習用サンプルです。

## 起動方法

`index.html` または `about.html` をブラウザで開きます。

`file://` で直接開いた場合、ブラウザや拡張機能によっては `file:` URL のセキュリティ警告が Console に出ることがあります。CSS、画像、JavaScript が読み込まれ、ボタン操作が動いていれば、このサンプルのJavaScriptエラーではありません。

警告を避けてNetwork確認をしたい場合は、このフォルダで簡易HTTPサーバーを起動します。

```bash
python -m http.server 8003
```

その後、ブラウザで `http://localhost:8003` を開きます。

## 正しいパス例

```html
<link rel="stylesheet" href="./styles/style.css">
<script src="./scripts/main.js" defer></script>
<img src="./images/avatar.svg" alt="アバター画像">
```

## 間違ったパス例

```html
<link rel="stylesheet" href="./style.css">
<script src="./main.js" defer></script>
<img src="./avatar.svg" alt="アバター画像">
```

上記はファイルが各フォルダ配下にあるため、Network タブで 404 になります。

## 確認ポイント

- `index.html` と `about.html` の両方で同じ CSS が反映される
- 両方のページでボタンを押すと JavaScript が動く
- 画像が表示される
