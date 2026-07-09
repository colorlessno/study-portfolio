# aws07 Lambda最小API 詳細設計

## 0. 関連文書

- `../requirements/aws07_lambda_local_api_requirements.md`
- `../basic_design/aws07_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/aws07_lambda_local_api/
  README.md
  docs/
src/backend/src/studyaws/systems/aws07_lambda_local_api/
  package.json
  Dockerfile or docker-compose.yml where applicable
  app/ api/ web/ src/ scripts/ events/ data/ storage as required by the local sample
src/infra/aws07_lambda_local_api/
  template.yaml where applicable
```

## 2. 実装詳細

- `handler.js`はAPI Gateway proxy風eventを受け取り、JSON responseを返す。
- `local_invoke.js`は`events/hello.json`を読み、handlerを直接呼ぶ。
- `template.yaml`はSAM CLI利用時の参考定義として置く。
- SAM CLIがなくても`npm run invoke`で動作確認できる。
## 3. 実行コマンド
```powershell
npm run invoke
npm run check
sam local invoke HelloFunction -e events/hello.json
```

`sam local invoke`はSAM CLIがある場合だけ実行する。
## 4. 確認手順
1. `npm run invoke`でhandlerの戻り値を確認する。
2. `statusCode`、`headers`、`body`が返ることを確認する。
3. eventのquery stringやbodyを変更して結果差分を見る。
4. SAM CLIがある場合のみ`sam local invoke`を試す。
## 5. 実AWS発展課題
SAM deployやAWS Lambda作成は発展課題とする。IAM、ログ、削除、課金注意を明記してから実施する。
## 6. 完了条件

- Lambda handlerの入出力を説明できる。
- SAM CLIなしでローカル確認できる。
- timeout、memory、環境変数の意味を説明できる。
