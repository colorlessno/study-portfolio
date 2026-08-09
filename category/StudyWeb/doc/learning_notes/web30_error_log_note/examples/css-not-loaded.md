# CSSが読み込まれない

## 基本情報

- 発生日: 2026-04-28
- サンプル名: web03_file_path_assets
- 環境: ローカルブラウザ
- 関連ファイル: `index.html`, `styles/style.css`
- タグ: `css`, `path`, `devtools`

## エラー内容

```text
GET file:///.../style.css net::ERR_FILE_NOT_FOUND
```

## 再現手順

1. `index.html` を開く
2. DevTools の Network タブを開く
3. CSSのステータスが失敗していることを確認する

## 原因

HTMLでは `style.css` を参照していたが、実際のファイルは `styles/style.css` に配置されていた。

## 解決方法

`index.html` の参照を `./styles/style.css` に修正した。

## 次回確認ポイント

- HTMLから見た相対パスになっているか
- Networkタブで404や読み込み失敗を確認する
