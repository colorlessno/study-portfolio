# web47 PDFアップロード詳細設計
## 0. 関連文書

- `../requirements/web47_pdf_upload_requirements.md`
- `../basic_design/web47_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web47_pdf_upload/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web47_pdf_upload/
  README.md
  docs/file_validation.md
  docs/metadata_design.md
```

## 2. 主要設計
| 検証 | 内容|
|---|---|
| extension | `.pdf` |
| MIME | `application/pdf` |
| size | 学習用上限 |
| metadata | name, size, type, hash |

## 3. 確認手順
1. PDFを選択する2. メタデータを表示する
3. 不正拡張子を試い4. サイズ超えを試い5. AI/RAG前処理の注意点を確認する
## 4. 完了条件

- PDF検証項目がある
- メタデータを表示できる
- 本体保存とメタデータ管理の違いを説明できる

