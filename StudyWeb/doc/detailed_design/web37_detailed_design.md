# web37 業務フォームの一部詳細設計
## 0. 関連文書

- `../requirements/web37_business_form_complete_requirements.md`
- `../basic_design/web37_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web37_business_form_complete/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web37_business_form_complete/
  README.md
  docs/form_state.md
  docs/validation_rules.md
```

## 2. 主要設計
| 項目| ルール |
|---|---|
| 顧客各| 必要。0文字以内|
| メール | 必要、メール形式|
| 備考| 任意。00文字以内|
| 状態| input / confirm / submitting / success / error |

## 3. 確認手順
1. 空欄信で項目別エラーを確認する2. 正常入力で確認画面へ進む
3. 送信中にボタンが無効化されることを確認する4. 成功・失敗表示を確認する
## 4. 完了条件

- 入力検証とエラー表示がある
- 二重送信を防げる
- labelとinputが対応してい

