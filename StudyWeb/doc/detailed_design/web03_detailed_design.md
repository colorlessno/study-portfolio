# web03 詳細設計## 画のCSS・JSのパス練習
---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web03_file_path_assets/
├── index.html
├── about.html
├── styles/
│  └── style.css
├── scripts/
│  └── main.js
├── images/
│  ├── avatar.svg
│  └── banner.svg
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| `index.html` | トップーージ | 共通CSS/JS/画像参照 |
| `about.html` | 2ページ目 | 同じパス参照の確認|
| `style.css` | 共通スタイル | 両HTMLに適用 |
| `main.js` | 共通動作| 読み込み確認|
| `images/` | 画像対象| 相対パス練習|

## 3. API 詳細

HTTP API は使用しないファイル参照パスを詳細IFとして扱い
| 呼び出し元 | 参照先| 目的|
|---|---|---|
| `index.html` | `styles/style.css` | CSS読込 |
| `index.html` | `scripts/main.js` | JS読込 |
| `index.html` | `images/avatar.svg` | 画像表示 |
| `about.html` | `styles/style.css` | CSS読込 |
| `about.html` | `scripts/main.js` | JS読込 |
| `about.html` | `images/banner.svg` | 画像表示 |

## 4. 詳細API I/O 定義

### 4.1 相対パスI/O

| パターン | 例| 用途|
|---|---|---|
| 同階層から子階層 | `styles/style.css` | HTMLからCSS |
| 同階層から子階層 | `images/avatar.svg` | HTMLから画像|
| 同階層ファイル | `about.html` | ページ遷移 |

### 4.2 DOM I/O

| 項目| DOM | 用途|
|---|---|---|
| パス確認ボタン | `.path-button` | JS読込確認の操作|
| パス確認メテージ | `.path-message` | JS読込確認の出力|

## 5. 入力チェック仕様
| 対象 | チェック項目| ルール |
|---|---|---|
| ファイル各| 大文字小文字| 英小文字中必要|
| パス | 存在 | 参照先が存在する |
| HTML | 共通パス参照 | 2ページで同じCSSが効い|

## 6. エラー応答仕様
| error_code | 発生条件 | 確認場所 |
|---|---|---|
| `asset_path_not_found` | 相対パス誤る| Network 404 |
| `style_not_applied` | CSS未読込 | 表示崩る|
| `script_not_executed` | JS未読込 | Console / 表示未更新 |

## 7. バリデーション一覧

| 対象 | ルール | 不正時挙動|
|---|---|---|
| CSS | `styles/style.css` を参照 | 404 |
| JS | `scripts/main.js` を参照 | 処理可 |
| 画像| `images/*.svg` を参照 | 画像未表示 |
| 複数ページ参照 | `index.html` と `about.html` の両方で CSS / JS / 画像を確認| 一部のみ成功するの場合HTMLごとの参照パスを確認|

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- DevTools Network で 404 を確認する
- Console のパス関連エラーを確認する
- README に正しい例と誤った例を併記する
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `./` は現在のディレクトリを示す
- `../` は1つ上のディレクトリを示す
- 本サンプルでは階層を深くしすぎず、HTMLから見た相対パスに集中する

