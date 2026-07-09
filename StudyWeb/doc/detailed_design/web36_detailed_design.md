# web36 localStorage注意点 詳細設計
## 0. 関連文書

- `../requirements/web36_localstorage_notes_requirements.md`
- `../basic_design/web36_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web36_localstorage_notes/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web36_localstorage_notes/
  README.md
  docs/storage_check.md
  docs/storage_risk_table.md
```

## 2. 主要設計
| 操作| 内容|
|---|---|
| 保存| key/valueをlocalStorageへ保存|
| 読み出し| 保存値を画面表示 |
| 削除 | 持つkeyを削除 |
| 確認| DevTools Applicationで確認|

## 3. 確認手順
1. 値を保存する2. reload後も残ることを確認する3. DevToolsで保存値を見る
4. 削除後に消えることを確認する5. 保存可否表を読む

## 4. 完了条件

- localStorageの寿命を説明できる
- tokenる人情報保存の危険性を説明できる
- 非機密だけを扱ってい

