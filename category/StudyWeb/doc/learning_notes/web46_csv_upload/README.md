# web46 CSVアップロード

CSV文字列をtextareaへ貼り付け、必須列、行データ、先頭3件のpreviewを確認する依存なしサンプル。現在は実ファイルのuploadではなく、CSV取込validationの最小概念を扱う。

## このテーマで身につけること

- headerとdata rowを分けて検証する
- ファイル全体エラーと行単位エラーを区別する
- 取込前previewが誤登録防止に役立つ理由を説明する
- 単純な文字列splitと実務CSV parserの差を理解する

## 10分で再開する

```powershell
cd category/StudyWeb\src\frontend\static\studyweb\systems\web46_csv_upload
docker build -t studyweb-web46 .
docker run --rm -p 3046:80 studyweb-web46
```

`http://localhost:3046/app/` を開く。終了は `Ctrl+C`。簡単な確認なら`app/index.html`を直接開ける。

構文確認:

```powershell
node --check app/src/main.js
```

## 最初に試す順番

1. 初期表示のCSVで`check`を押し、preview 1件・success 1を確認する
2. `samples/valid.csv`の内容を貼り付け、success 2を確認する
3. `samples/invalid.csv`を貼り付け、2行目・3行目のエラーを見る
4. headerから`price`を削除し、missing columnを確認する
5. 4行以上を入力し、previewが先頭3件だけになることを確認する

形式は [CSV Format](docs/csv_format.md)、結果の考え方は [Import Result](docs/import_result.md) を参照する。

## コードを読む順番

1. `app/index.html`でtextarea、check button、出力先を見る
2. 改行でlineへ分割し、先頭行をheaderとして取り出す処理を見る
3. `required`列とheaderを比較する処理を見る
4. 各lineをheader名付きobjectへ変換する処理を追う
5. code・name・priceの行validationを見る
6. preview、success、errorsをJSON表示する箇所を見る

## 現実装の範囲

- `<input type="file">`、multipart/form-data、upload APIはない
- 拡張子・ファイルサイズ・文字コードを検証しない
- commaで単純分割するため、引用符内comma・改行・escaped quoteを扱えない
- priceの空文字は`Number('') === 0`のため不正として検出できない
- 1行でもエラーがあればsuccessを0にし、成功行・失敗行を別々に数えない
- previewはparse結果の先頭3件で、DBへの取込や保存は行わない

要件にある「ファイルupload完全版」ではなく、CSV構造と行validationの入口である。

## 壊して確かめる

- priceを空欄にし、現在エラーにならない問題を再現して修正する
- `"P001","Pen, Blue",120`を入力し、単純splitの限界を確認する
- 成功行数と失敗行数を別々に数える
- 同じcodeの重複を検出する
- file inputからUTF-8 CSVを読んでtextareaへ表示する
- CSV parserライブラリ版へ置き換え、quoted fieldを比較する

## 自分の言葉で説明する

- headerエラーとrowエラーは利用者の直し方がどう違うか
- previewを出してから確定取込する理由は何か
- CSVを`split(',')`だけで処理できないケースは何か
- 一部成功を許可するか全件rollbackするか、どんな判断が必要か

## 完了条件

- valid / invalidの両sampleを確認した
- missing columnと行単位エラーを再現した
- price空欄またはquoted commaの問題を修正した
- 現在はファイルupload APIではないことを説明できる
