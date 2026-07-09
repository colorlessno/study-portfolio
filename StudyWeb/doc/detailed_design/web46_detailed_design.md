# web46 CSVアップロード詳細設計
## 0. 関連文書

- `../requirements/web46_csv_upload_requirements.md`
- `../basic_design/web46_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web46_csv_upload/
  Dockerfile
  app/index.html
  app/src/main.js
  samples/valid.csv
  samples/invalid.csv
doc/learning_notes/web46_csv_upload/
  README.md
  docs/csv_format.md
  docs/import_result.md
```

## 2. 主要設計
| 項目 | ルール |
|---|---|
| code | 必須|
| name | 必須|
| price | 数値 |

## 3. 確認手順
1. valid.csvをアップロードする2. previewを確認する3. invalid.csvをアップロードする4. 行単位エラーを確認する5. 成功・失敗件数を確認する
## 4. 完了条件

- CSV検証ができる
- previewが表示される
- 行単位エラーがわかる

