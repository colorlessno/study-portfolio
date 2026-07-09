# web01 詳細設計## 静的自己紹介ページ

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web01_static_first_page/
├── index.html
├── styles.css
├── script.js
└── README.md
```

| パス | 役割 |
|---|---|
| `index.html` | ページ構造、表示テスト、ボタン、表示領域を定義する |
| `styles.css` | ページ全体、カード、リスト、ボタン、メテージ領域の見た目を定義する |
| `script.js` | DOM要素取得、イベント登録、クリック時の表示更新を行う |
| `README.md` | 目的起動方法、確認手順学習ポイントを記載する|

---

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| HTML構造 | 自己紹介ページの文字構造を定義 | 見出し、ロフィール、リスト、ボタン、入力領域 |
| CSSスタイル | 画面の見た目を定義 | 余白、背景、カード、ボタン、リスト、メテージ領域 |
| JavaScript処理| ユーザー操作に応じて表示を変える| DOM取得、イベント登録、メテージ更新 |
| README | 学習用ドキュメンテ| 開き方、確認観点、ファイル役割説明|

### 2.1 HTML詳細

`index.html` は次の構造を持つ。
```text
html
└── body
    └── main.profile-card
        ├── h1
        ├── section.profile-summary
        ├── section.profile-list
        ├── button#messageButton
        └── p#messageOutput
```

### 2.2 CSS詳細

主要セレクタ:

| セレクタ | 用途|
|---|---|
| `body` | ページ全体の背景、文字、余白 |
| `.profile-card` | 自己紹介カードの幅余白、枠線、影 |
| `.profile-list` | 箇所書き領域 |
| `button` | 操作ボタンの見た目 |
| `#messageOutput` | JavaScript の出力結果表示 |

### 2.3 JavaScript詳細

主な処理

| 処理| 内容|
|---|---|
| DOM取得| `messageButton` と `messageOutput` を取得する|
| イベント登録 | ボタンに `click` イベントを登録する |
| 表示更新 | クリック時に `messageOutput.textContent` を更新する |

---

## 3. API 詳細

本サンプルでは HTTP API は使用しない
代替として、画面内ベントを詳細IFとして定義する。
### 3.1 画面イベント
| イベントD | 発生元 | トリガー | 処理| 結果 |
|---|---|---|---|---|
| `EVT-001` | `messageButton` | click | メテージ文列を成する | `messageOutput` を更新 |

### 3.2 ファイル読み込み

| 読み込みID | 呼び出し元 | 対象 | 記述例|
|---|---|---|---|
| `LOAD-001` | `index.html` | `styles.css` | `<link rel="stylesheet" href="./styles.css">` |
| `LOAD-002` | `index.html` | `script.js` | `<script src="./script.js" defer></script>` |

---

## 4. 詳細API I/O 定義

HTTP API はないめ、DOM I/O と画面表示項目を定義する。
### 4.1 DOM入力
| 項目| DOM | 型| 必須| 説明|
|---|---|---|---|---|
| メテージ表示ボタン | `#messageButton` | HTMLButtonElement | ○| クリックイベントの起点 |

### 4.2 DOM出力
| 項目| DOM | 型| 更新方法| 説明|
|---|---|---|---|---|
| メテージ表示領域 | `#messageOutput` | HTMLElement | `textContent` | クリック後メテージを表示 |

### 4.3 表示テステ
| 項目| 例| 備考|
|---|---|---|
| ページタイトル | `自己紹介ページ` | `h1` |
| 名前 | `Web学習者 | 固定テキスト|
| 自己紹介文 | `HTML/CSS/JavaScriptを学習中です。` | 固定テキスト|
| 箇所書い| 好きなの、学習中のこと、目標| `ul` / `li` |
| クリック後メテージ | `こんにちは。avaScriptで表示を変更しました。` | JSで設定|

---

## 5. 入力チェック仕様
### 5.1 DOM存在チェック

| 対象 | チェック項目| ルール | 不正時挙動|
|---|---|---|---|
| `#messageButton` | 要素存在 | `null` でないと | Console にエラーを出して処理断 |
| `#messageOutput` | 要素存在 | `null` でないと | Console にエラーを出して処理断 |

### 5.2 文列チェック

| 対象 | チェック項目| ルール |
|---|---|---|
| クリック後メテージ | 空文列| 空文字にしない|
| 表示テステ| 長い| 初学者読みるい文字する |

---

## 6. エラー応答仕様
HTTP API はないめ、エラーはブラウザ Console と画面表示で扱い
| error_code | 発生条件 | 表示/出力| 対処|
|---|---|---|---|
| `dom_element_not_found` | 対象DOMが取得できない| Console error | `id` 名とHTML構造を確認|
| `script_not_loaded` | JSファイルが読み込まれない| Console / Network | `<script>` の `src` を確認|
| `style_not_loaded` | CSSファイルが読み込まれない| 見た目が未適用 | `<link>` の `href` を確認|

Console出力例

```text
web01: required element was not found.
```

---

## 7. バリデーション一覧

| 対象 | ルール | 不正時挙動|
|---|---|---|
| `messageButton` | HTML上に1つ存在する | イベント登録しない|
| `messageOutput` | HTML上に1つ存在する | 表示更新しない|
| `script.js` 読み込み | `defer` を付与する| DOM取得タイミング不整合の原因としてREADMEに記較|
| CSS列| インラインstyleを多用しない| レビュー時に修正 |

---

## 8. データベース詳細

本サンプルではデータベースを使用しない
### 8.1 画面内ータ

| データ各| 型| 定義場所 | 更新有無 |
|---|---|---|---|
| `profileName` | string相当| HTML | ない|
| `profileDescription` | string相当| HTML | ない|
| `profileItems` | string[]相当| HTML | ない|
| `messageText` | string | JavaScript | クリック時に出力|

---

## 9. AI 処理詳細

本サンプルでは AI 処理使用しない
---

## 10. エラー・監査設計
### 10.1 エラー確認方法
| 確認対象 | 確認方法|
|---|---|
| CSS未読込 | 画面の見た目、DevTools Network |
| JS未読込 | Console、ボタンクリック時の反必要|
| DOM取得失敗| Console error |

### 10.2 監査・ログ

本サンプルではサーバーログる査ログは扱わない学習目的して、ブラウザ Console のみ確認対象とする。
---

## 11. DDL

本サンプルではデータベースを使用しないめ、DDL は存在しない
参者して、ファイル成果物の成単位を以下に示す。
```text
CREATE FILE index.html;
CREATE FILE styles.css;
CREATE FILE script.js;
CREATE FILE README.md;
```

---

## 12. 実装メモ

### 12.1 `index.html` 実装点

- `<!doctype html>` を記述する
- `<meta charset="UTF-8">` を指定する
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` を指定する
- CSS は `<head>` 内で読み込む
- JavaScript は `defer` 付きで読み込む

### 12.2 `script.js` 実装点

実装メージ:

```javascript
const messageButton = document.getElementById("messageButton");
const messageOutput = document.getElementById("messageOutput");

if (!messageButton || !messageOutput) {
  console.error("web01: required element was not found.");
} else {
  messageButton.addEventListener("click", () => {
    messageOutput.textContent = "こんにちは。avaScriptで表示を変更しました。;
  });
}
```

### 12.3 README 記載要点

- このサンプルの目的
- `index.html` の開き方
- HTML / CSS / JavaScript の役割
- ボタンクリックで確認すること
- CSSやJSが反映されない合わせ確認箇所

