# web46 CSVアップロード 詳細設計

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

## 2. 現在の位置付け

実ファイルuploadではなく、textareaへ貼り付けたCSV文字列をparse・validateする概念サンプル。multipart/form-data、server API、保存は未実装。

## 3. 入力形式

| Column | 必須 | Rule |
|---|---|---|
| `code` | はい | 空でない |
| `name` | はい | 空でない |
| `price` | はい | `Number()`がNaNでない |

headerは先頭行。data rowは2行目以降。

## 4. 処理手順

1. textareaをtrimして改行単位へ分割する。
2. 先頭lineをcommaで分割しheaderとする。
3. required columnがheaderにあるか検証する。
4. 各data lineをcommaで分割し、header名付きobjectへ変換する。
5. code・name・priceを行単位で検証する。
6. 先頭3件をpreviewとして選ぶ。
7. errorがなければ全行数、あれば0をsuccessへ設定する。
8. preview・success・errorsをJSON表示する。

## 5. Output

| 項目 | 内容 |
|---|---|
| preview | parse結果の先頭3件 |
| success | 全件正常時の行数。error時は0 |
| errors | missing column、`line N: invalid data` |

## 6. 要件との差分・既知の課題

- file input、拡張子・size・文字コード検証がない。
- 引用符、引用符内comma・改行を扱えない。
- price空文字を0として許可する。
- 成功件数・失敗件数を個別に集計しない。
- API・DB・transaction・重複検出がない。
- sample fileは手動で内容を貼り付けて使う。

## 7. 確認手順

1. valid.csvでpreviewとsuccess 2を確認する。
2. invalid.csvで2行分のerrorを確認する。
3. required columnを削除しmissing columnを確認する。
4. 4行以上でpreviewが3件に限定されることを確認する。
5. 空priceとquoted commaの問題を再現する。

## 8. 完了条件

- header・row validationを説明できる。
- line番号付きerrorを確認できる。
- previewの目的を説明できる。
- 現実装とfile upload完全版の差を説明できる。
