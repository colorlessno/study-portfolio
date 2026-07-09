# web44 注文字ステータス遷移 詳細設計
## 0. 関連文書

- `../requirements/web44_order_status_transition_requirements.md`
- `../basic_design/web44_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web44_order_status_transition/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web44_order_status_transition/
  README.md
  docs/status_transition_table.md
  docs/transition_check.md
```

## 2. 主要設計
| Status | 許可遷移 |
|---|---|
| draft | confirmed, canceled |
| confirmed | shipped, canceled |
| shipped | completed |
| completed | ない|
| canceled | ない|

## 3. 確認手順
1. 許可遷移を実行する2. 不正遷移を実行する3. 業務エラーを確認する4. 遷移履歴を確認する
## 4. 完了条件

- 状態遷移表がある
- 不正遷移を防げる
- 履歴が残る

