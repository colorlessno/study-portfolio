# web47 PDFアップロード

ブラウザで選択したファイルのname、size、MIME typeを表示し、拡張子・MIME type・1MiB上限を確認する静的サンプル。現在はファイルをサーバーへ送らず、client側validationの入口だけを扱う。

## このテーマで身につけること

- 拡張子、MIME type、sizeを別々の検証項目として扱う
- browserが提供するmetadataを信頼しすぎてはいけない理由を説明する
- ファイル本体とDB等に保存するmetadataを分離する
- AI / RAG処理へ渡す前に必要な安全確認を整理する

## 10分で再開する

```powershell
cd StudyWeb\src\frontend\static\studyweb\systems\web47_pdf_upload
docker build -t studyweb-web47 .
docker run --rm -p 3047:80 studyweb-web47
```

`http://localhost:3047/app/` を開く。終了は `Ctrl+C`。簡単な確認なら`app/index.html`を直接開ける。

構文確認:

```powershell
node --check app/src/main.js
```

実データや機密文書ではなく、確認用の小さなダミーファイルを使う。

## 最初に試す順番

1. 1MiB以下のPDFを選び、name・size・typeとerrors空配列を確認する
2. `.txt`等を選べるようfile pickerの種類を変更し、extension errorを見る
3. 1MiBを超えるダミーファイルでsize errorを確認する
4. DevToolsでfile inputの`accept`を外し、`accept`が安全性保証ではないことを確認する
5. 同じファイルを選び直したときのchange eventを観察する

検証項目は [File Validation](docs/file_validation.md)、保存情報は [Metadata Design](docs/metadata_design.md) を参照する。

## コードを読む順番

1. `app/index.html`のfile inputと`accept="application/pdf"`を見る
2. change eventで最初のFileを取得する箇所を見る
3. fileがなければ終了する分岐を見る
4. nameの末尾、type、sizeを個別に検証する処理を追う
5. metadataとerrorsをJSON表示する箇所を見る

## 現実装の範囲

- browser内でmetadataを見るだけで、multipart upload APIはない
- ファイル本体を保存せず、hashも計算しない
- 拡張子はファイル名、MIME typeはbrowser提供値なので偽装・欠落し得る
- typeが空文字の場合はMIME errorを出さない
- PDF signature（`%PDF-`）、暗号化、ページ数、破損を確認しない
- ウイルスscan、sandbox、OCR / RAG投入は対象外

client側validationはUX向上にはなるが、安全性の最終判断はserver側で再実施する必要がある。

## 壊して確かめる

- file sizeの上限を変え、境界値ちょうど・1byte超過を確認する
- typeが空でも警告する方針へ変更する
- `crypto.subtle.digest`でSHA-256を計算し、metadataへ追加する
- 先頭bytesを読み、`%PDF-` signatureを確認する
- server upload版のvalidation順序と保存前処理を設計する
- AI処理待ちのstatusをmetadataへ追加する

## 自分の言葉で説明する

- `accept`、拡張子、MIME typeだけで安全と判断できないのはなぜか
- ファイル本体とmetadataはどこに何を保存するか
- hashは重複検出・整合性確認にどう使えるか
- RAGへ渡す前に、なぜvalidationやscanが必要か

## 完了条件

- 正常PDF、拡張子不正、size超過を確認した
- client validationをserverでも再実施する理由を説明できる
- metadataへhash等を1項目追加した
- 現在はupload・保存を行わないことを説明できる
