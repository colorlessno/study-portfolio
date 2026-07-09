# web45 楽観ロック詳細設計
## 0. 関連文書

- `../requirements/web45_optimistic_lock_requirements.md`
- `../basic_design/web45_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web45_optimistic_lock/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web45_optimistic_lock/
  README.md
  docs/conflict_flow.md
  docs/optimistic_lock_check.md
```

## 2. 主要設計
| 項目| 内容|
|---|---|
| record | id, name, version |
| read | versionを含めて返す |
| update | version一致時のみ更新 |
| conflict | 409を返す |

## 3. 確認手順
1. 同じrecordるつの画面状態で読む
2. 一部で更新する
3. もう一部で古いversionのまま更新する
4. 409と再読込案のを確認する
## 4. 完了条件

- version不一致を検出できる
- 409を返せる
- 上書き事故を防ぐ理由を説明できる

