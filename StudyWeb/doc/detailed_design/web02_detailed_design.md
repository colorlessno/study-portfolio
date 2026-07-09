# web02 詳細設計## ブラウザ通信観察サンプル

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web02_browser_network/
├── index.html
├── styles/
│  └── style.css
├── scripts/
│  └── main.js
├── images/
│  └── profile-placeholder.svg
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| HTML | CSS / JS / 画像を参照するページ本体| `<link>`, `<script>`, `<img>` |
| CSS | 画面の見た目 | レイアウト、色、余白 |
| JavaScript | 読み込み確認| ボタン操作、メテージ更新 |
| 画像| Network確認対象 | Imageリクエスト発生|
| README | 観察手順| DevTools Network の見る項目|

## 3. API 詳細

HTTP API は使用しないブラウザによる静的リソース読み込みを観察対象とする。
| リソース | パス | 期得ype |
|---|---|---|
| HTML | `index.html` | document |
| CSS | `styles/style.css` | stylesheet |
| JS | `scripts/main.js` | script |
| 画像| `images/profile-placeholder.svg` | image |

## 4. 詳細API I/O 定義

### 4.1 ファイル読み込みI/O

| 呼び出し元 | 入力参照 | 出力|
|---|---|---|
| `index.html` | `styles/style.css` | CSS適用 |
| `index.html` | `scripts/main.js` | イベント登録 |
| `index.html` | `images/profile-placeholder.svg` | 画像表示 |

### 4.2 DOM I/O

| 項目| DOM | 用途|
|---|---|---|
| 確認ボタン | `#checkButton` | JS読み込み確認|
| 出力領域 | `#loadStatus` | クリック後メテージ |

## 5. 入力チェック仕様
| 対象 | チェック項目| ルール |
|---|---|---|
| ファイルパス | 存在 | CSS / JS / 画像が持つパスに存在する |
| DOM | 要素存在 | `#checkButton`, `#loadStatus` が存在する |
| Network確認| Status | 各ソースい200 で取得される |

## 6. エラー応答仕様
| error_code | 発生条件 | 確認場所 |
|---|---|---|
| `css_not_loaded` | CSSパス誤る| Network / 表示崩る|
| `script_not_loaded` | JSパス誤る| Console / ボタン無反必要|
| `image_not_loaded` | 画像パス誤る| Network / broken image |

## 7. バリデーション一覧

| 対象 | ルール | 不正時挙動|
|---|---|---|
| CSS参照 | `styles/style.css` | 404 |
| JS参照 | `scripts/main.js` + `defer` | イベント未登録 |
| 画像参照 | `images/...` | 画像未表示 |

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- Network タブで URL / Status / Type / Size / Time を確認する
- Console にエラーがあった場合はファイルパスとDOM IDを確認する
- サーバーログや監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- README に DevTools の開き方を記載する
- `Disable cache` を有効にした場合の見え方も補足する
- 簡易HTTPサーバーで開くの場合コマンド例を記載してもよい
