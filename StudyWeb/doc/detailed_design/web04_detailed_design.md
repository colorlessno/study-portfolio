# web04 詳細設計## 素のJavaScriptによるDOM操作
---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web04_vanilla_dom/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| HTML | ボタンと結果表示領域 | 操作対象DOMを定義 |
| CSS | 表示調整 | ボタン、結果領域の見た目 |
| JavaScript | DOM操作| 要素取得、イベント登録、表示変更 |
| README | 学習手順| DOM操成確認方法|

## 3. API 詳細

HTTP API は使用しない画面イベントをIFとして定義する。
| イベントD | 発生元 | トリガー | 処理|
|---|---|---|---|
| `EVT-CHANGE` | `#changeButton` | click | 結果表示を変更 |
| `EVT-RESET` | `#resetButton` | click | 結果表示を初期化 |

## 4. 詳細API I/O 定義

| 項目| DOM | I/O | 説明|
|---|---|---|---|
| 変更ボタン | `#changeButton` | input | 表示変更操作|
| リセットボタン | `#resetButton` | input | 初期化操作|
| 結果表示 | `#resultText` | output | JSで更新 |

## 5. 入力チェック仕様
| 対象 | チェック項目| ルール |
|---|---|---|
| DOM取得| nullチェック| 対象要素が存在する |
| イベント登録 | 1のみ | 重複録しない|
| 表示文列 | 空文字不可 | 結果がわかる文字にする |

## 6. エラー応答仕様
| error_code | 発生条件 | 出力|
|---|---|---|
| `dom_not_found` | ボタンまたは表示領域がない| Console error |
| `script_load_failed` | JS未読込 | Console / 無反必要|

## 7. バリデーション一覧

| 対象 | ルール | 不正時挙動|
|---|---|---|
| `#changeButton` | 存在必須| イベント登録しない|
| `#resetButton` | 存在必須| イベント登録しない|
| `#resultText` | 存在必須| 表示更新しない|

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- Console に DOM取得失敗を出力する
- 監査ログは扱わない
- README に `onclick` 属性を使わない理由を記載する
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

```javascript
const changeButton = document.getElementById("changeButton");
const resetButton = document.getElementById("resetButton");
const resultText = document.getElementById("resultText");
```

- イベント登録には `addEventListener` を使う
- 表示更新には `textContent` を使う
