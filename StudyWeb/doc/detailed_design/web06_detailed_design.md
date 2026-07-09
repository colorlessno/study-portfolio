# web06 詳細設計## 入力フォームとバリデーション

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web06_form_basic/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| HTML | フォーム定義 | input, select, textarea |
| CSS | フォームUI | 入力欄エラー、ボタン |
| JavaScript | 入力検証 | submit制御、エラー表示 |
| README | 確認手順| 正常系/異常系入力例|

## 3. API 詳細

HTTP API は使用しないフォームイベントをIFとして扱い
| イベントD | 発生元 | 処理|
|---|---|---|
| `FORM-SUBMIT` | `#contactForm` | 入力検証 |
| `FORM-RESET` | reset button | 入力とメテージ初期化|

## 4. 詳細API I/O 定義

| 項目| DOM | 型| 必須|
|---|---|---|---|
| 名前 | `#name` | string | ○|
| メール | `#email` | string | ○|
| 種別 | `#category` | string | ○|
| 本文| `#message` | string | ○|

| 出力| DOM | 内容|
|---|---|---|
| エラー | `.error-message` | 項目別エラー |
| 成功 | `#formResult` | 送信成功メテージ |

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| 名前 | 空不可 | エラー表示 |
| メール | 空不可、メール形式| エラー表示 |
| 種別 | 未選択不可 | エラー表示 |
| 本文| 空不可 | エラー表示 |

## 6. エラー応答仕様
| error_code | 発生条件 | 表示 |
|---|---|---|
| `required` | 必要未入力| `入力してください` |
| `invalid_email` | メール形式不正 | `メールアドレスの形式が正しくありません` |

## 7. バリデーション一覧

| 対象 | 実装式|
|---|---|
| required | JavaScript の trim チェック|
| email | 簡易正規表現または `input[type=email]` の値確認|
| submit | `preventDefault()` でページ遷移防止 |

## 8. データベース詳細

DBは使用しない力値は送信風確認後に保存しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- エラーは入力の近くに表示する
- Consoleエラーがあるかないかを確認する
- 実送信や監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `form.addEventListener("submit", handleSubmit)` を使う
- `reset` 時の入力欄エラー、結果表示をすべて初期化する
- 成功時も実際のメール送信は行わない
