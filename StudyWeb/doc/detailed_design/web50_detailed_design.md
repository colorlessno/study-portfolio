# web50 N+1問の再現 詳細設計
## 0. 関連文書

- `../requirements/web50_n_plus_one_reproduction_requirements.md`
- `../basic_design/web50_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web50_n_plus_one_reproduction/
  Dockerfile
  package.json
  app/src/
doc/learning_notes/web50_n_plus_one_reproduction/
  README.md
  docs/query_log_comparison.md
  docs/n_plus_one_note.md
```

## 2. 主要設計
| mode | 内容|
|---|---|
| n_plus_one | 親一覧取得後、子を個別取得|
| optimized | 親子をまとめて取得|
| log | query回数を記録 |

## 3. 確認手順
1. N+1モードで取得する2. query countを記録する
3. optimizedモードで取得する4. query countを比較る
## 4. 完了条件

- N+1を再現できる
- 改善後のクエリ回数を比較きる
- ORM利用時の注意点を説明できる

