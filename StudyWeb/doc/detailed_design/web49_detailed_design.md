# web49 retry / timeout 詳細設計
## 0. 関連文書

- `../requirements/web49_retry_timeout_requirements.md`
- `../basic_design/web49_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web49_retry_timeout/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web49_retry_timeout/
  README.md
  docs/retry_policy.md
  docs/timeout_check.md
```

## 2. 主要設計
| mode | 挙動 |
|---|---|
| success | 即成功 |
| slow | timeout確認|
| temporary | retry後の力|
| permanent | retry対象外失敗|

## 3. 確認手順
1. successを確認する2. slowでtimeoutを確認する3. temporaryでretry成功を確認する4. permanentでretryしないとを確認する5. retry logを確認する
## 4. 完了条件

- timeoutが効く
- retry上限がある
- retry対象外エラーを区別できる

