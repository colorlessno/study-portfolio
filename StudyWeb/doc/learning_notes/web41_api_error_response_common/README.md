# web41 APIエラーレスポンス共通化

validation、business、systemのエラーを共通JSON形式で返し、フロントエンドの表示先を判断するためのAPI契約を学ぶテーマです。

## このテーマでできるようになること

- エラーレスポンスの共通schemaを説明できる
- HTTP 400、409、500を用途別に使い分けられる
- 項目別エラーと画面全体エラーの表示先を設計できる
- system errorで内部情報を隠す理由を説明できる

## 関連資料

1. [要件定義](../../requirements/web41_api_error_response_common_requirements.md)
2. [基本設計](../../basic_design/web41_basic_design.md)
3. [詳細設計](../../detailed_design/web41_detailed_design.md)
4. [エラー形式](./docs/error_format.md)
5. [UIマッピング](./docs/error_mapping.md)
6. [サーバー実装](../../../src/backend/src/studyweb/systems/web41_api_error_response_common/api/src/server.js)

## 資料を見る前の確認問題

- 利用者向けmessageと開発者向け内部情報を分ける理由は何ですか。
- validation errorとbusiness errorは、UI上のどこへ出すべきでしょうか。
- requestIdは、どのような調査で役立ちますか。

## 15分で再開する

1. APIを起動する。
2. validation、business、systemの3パスを呼ぶ。
3. status、code、message、details、requestIdを比較する。
4. [UIマッピング](./docs/error_mapping.md)へ各エラーを当てはめる。

## 起動方法

実装ディレクトリで実行します。

```powershell
npm.cmd start
```

構文確認は`npm.cmd run build`で実行します。

## 確認コマンド

```powershell
curl.exe -i http://localhost:3041/validation
curl.exe -i http://localhost:3041/business
curl.exe -i http://localhost:3041/system
curl.exe -i http://localhost:3041/health
```

`/health`は専用health routeではなく、その他パスとして`{ "ok": true }`を返す確認例です。

## コードを読む順番

1. `docs/error_format.md`で共通schemaを見る。
2. `api/src/server.js`の`requestId`、`send`、`error`を見る。
3. 3つのパスとHTTP statusの対応を見る。
4. `docs/error_mapping.md`でフロント表示先を確認する。
5. 詳細設計で現在の簡易実装の制約を読む。

## 比較表

| パス | status | code | UI表示の想定 |
|---|---:|---|---|
| `/validation` | 400 | `VALIDATION_ERROR` | name入力欄の近く |
| `/business` | 409 | `ORDER_ALREADY_CLOSED` | 画面またはフォーム上部 |
| `/system` | 500 | `INTERNAL_ERROR` | 共通通知領域 |
| その他 | 200 | なし | 正常結果 |

## 観察ポイント

- 3エラーで外側のJSON構造が同じか
- validationだけdetailsにfield情報があるか
- system responseにstack traceやファイルパスがないか
- requestIdが`req_`で始まるか
- codeは機械判定、messageは利用者表示に使えるか

## 壊して直す演習

1. `/validation?source=test`を呼び、完全一致ルーティングの制約を見る。
2. POSTで`/validation`を呼び、現実装がHTTPメソッドを検証しないことを確認する。
3. systemのmessageへ内部情報を入れた場合の危険性を考え、実際の文言は変更しない。
4. `details`のfieldを`unknown`へ一時的に変え、UIマッピング不能になる理由を考える。

## 自分の言葉で説明する

- 共通schemaの4フィールドを、それぞれ誰が何に使うか説明してください。
- 400、409、500を同じmessageだけで返すと何が困りますか。
- requestIdがレスポンスにあるだけでは不十分な理由は何ですか。

## うまく動かないとき

- 接続できない場合は、3041番ポートとNodeプロセスを確認します。
- 期待したエラーにならない場合は、queryを含まない完全一致のパスか確認します。
- JSONが読めない場合は、statusとレスポンスbodyを`curl.exe -i`で分けて確認します。

## 学習完了の目安

- [ ] 400、409、500、200を確認した
- [ ] 共通schemaとUI表示先を説明できた
- [ ] queryまたはHTTPメソッドの制約を観察した
- [ ] system errorが内部情報を返さないことを確認した
