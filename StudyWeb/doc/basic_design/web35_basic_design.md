# web35 HTTPステータス設計 基本設計
## 0. 関連要件

- `../requirements/web35_http_status_design_requirements.md`

## 1. 設計目的
主要HTTPステータスをAPIの正常系・異常系として使い分けるサンプルを設計する。
## 2. 対象範囲

- 200 / 201
- 400 / 401 / 403 / 404 / 409 / 500
- error response body
- curl確認
## 3. 成果物構成

```text
src/backend/src/studyweb/systems/web35_http_status_design/
  api/
  Dockerfile
  package.json
doc/learning_notes/web35_http_status_design/
  README.md
  docs/
    status_code_matrix.md
    curl_examples.md
```

## 4. 入力
| 入力| 内容|
|---|---|
| API request | 正常・異常パターン |
| auth header | 401 / 403確認用 |
| duplicate data | 409確認用 |

## 5. 出力
| 出力| 内容|
|---|---|
| status code | 各ケースのHTTPステータス |
| error body | code, message, details |
| 確認ログ | curl実行結果 |

## 6. 処理手順
1. 各statusを返すendpointを用意する
2. 正常系と異常系をcurlで確認する
3. error bodyを共通形式にする
4. 401と403の違いを確認する
5. 500で内部情報を出さないことを確認する
## 7. 確認観点

- status codeの意味を説明できる
- error bodyがフロントで扱いやすい
- 内部情報を返していないか

## 8. 後続工程への引き継ぎ

詳細設計では、endpoint、エラー形式、status確認コマンドを定義する。
