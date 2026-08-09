# base10 curl API確認

UIを介さずAPIへ直接requestを送り、method、path、header、body、status、responseから問題を切り分けます。

## 到達目標

- HTTP requestとresponseの構成を説明できる。
- 2xx、4xx、5xxを失敗原因の層として区別できる。
- 認証なし、権限不足、不正入力、server errorを再現できる。

## 教材

- [サンプルAPI](../../../src/samples/base10_curl_api_check/sample_api/)
- [GET例](commands/curl_get_examples.md) / [POST例](commands/curl_post_examples.md) / [失敗例](commands/curl_error_examples.md)
- [API記録](notes/api_check_log.md) / [frontendとの分離](notes/frontend_api_split_note.md)
- [要件定義](../../requirements/base10_curl_api_check_requirements.md) / [基本設計](../../basic_design/base10_basic_design.md) / [詳細設計](../../detailed_design/base10_detailed_design.md)

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base10
```

検証器は一時portでAPIを起動し、200、201、400、401、403、404、500を確認して停止します。手動確認では別ターミナルでサーバーを起動し、commandsの例を実行します。

```powershell
npm --prefix category/StudyBase\src\samples\base10_curl_api_check\sample_api start
```

終了時は`Ctrl+C`で停止します。

## 完了条件

各statusについてrequest、期待response、原因層、次の確認をAPI記録へ残せれば完了です。
