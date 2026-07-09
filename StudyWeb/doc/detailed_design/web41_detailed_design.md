# web41 APIエラーレスポンス共通化 詳細設計
## 0. 関連文書

- `../requirements/web41_api_error_response_common_requirements.md`
- `../basic_design/web41_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web41_api_error_response_common/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web41_api_error_response_common/
  README.md
  docs/error_format.md
  docs/error_mapping.md
```

## 2. 主要設計
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力の容を確認してください",
    "details": [],
    "requestId": "req_xxx"
  }
}
```

| 種別 | 表示 |
|---|---|
| validation | 項目別 |
| business | 画面上部 |
| system | 汎用メテージ |

## 3. 確認手順
1. validation errorを発生させる
2. business errorを発生させる
3. system errorを発生させる
4. UI表示の違いを確認する
## 4. 完了条件

- 共通error schemaがある
- 内部情報を返さない
- requestIdを確認できる

