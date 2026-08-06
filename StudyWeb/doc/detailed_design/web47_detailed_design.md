# web47 PDFアップロード 詳細設計

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

## 2. 現在の位置付け

browserで選択したFile metadataをclient側で検証する静的サンプル。server upload、temporary storage、DB metadata保存は未実装。

## 3. 入力

| 項目 | 内容 |
|---|---|
| file input | `accept="application/pdf"` |
| name | 元filename |
| size | byte数 |
| type | browser提供MIME type |

## 4. Validation

| 検証 | 条件 | Error |
|---|---|---|
| extension | 小文字化したnameが`.pdf`で終わる | `extension must be .pdf` |
| MIME | typeが空でなく`application/pdf`以外 | `unexpected type ...` |
| size | 1MiBを超える | `file too large for this sample` |

## 5. 処理手順

1. change eventで先頭のFileを取得する。
2. Fileがなければ終了する。
3. extension、MIME type、sizeを順に検証する。
4. name・size・type・errorsをJSON表示する。

## 6. 要件との差分・既知の課題

- multipart upload APIとファイル本体保存がない。
- hash、storage key、upload statusを作らない。
- extension・MIMEは偽装可能で、PDF signatureを確認しない。
- type空文字をerrorにしない。
- malware scan、暗号化・破損PDF判定、OCR / RAG処理がない。
- client validationだけで、server側再検証がない。

## 7. 確認手順

1. 1MiB以下のPDFでmetadataを確認する。
2. 不正extension・MIME・size超過を個別に確認する。
3. 1MiBちょうどと1byte超過の境界を確認する。
4. hashまたはsignature確認を追加する。
5. server側validationの順序を設計する。

## 8. 完了条件

- extension・MIME・sizeを区別できる。
- client側だけでは安全性を保証できないと説明できる。
- 本体とmetadataの保存先を分けて説明できる。
- AI処理前に必要な安全確認を説明できる。
