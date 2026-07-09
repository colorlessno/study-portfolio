# web43 idempotency key 詳細設計
## 0. 関連文書

- `../requirements/web43_idempotency_key_requirements.md`
- `../basic_design/web43_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web43_idempotency_key/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web43_idempotency_key/
  README.md
  docs/idempotency_flow.md
  docs/duplicate_check.md
```

## 2. 主要設計
| 要素 | 内容|
|---|---|
| Header | `Idempotency-Key` |
| Store | 学習用メモリMap |
| 初回 | 成して結果保存|
| 再送信| 保存済み結果を返す |
| keyない| 400 |

## 3. 確認手順
1. keyなしで400を確認する2. 新しいkeyで登録する
3. 同じkeyで再送する4. 登録件数が増えないとを確認する
## 4. 完了条件

- 同一keyで二重登録されない
- 再送時の挙動を説明できる
- フロントのボタン無効化との差を説明できる

