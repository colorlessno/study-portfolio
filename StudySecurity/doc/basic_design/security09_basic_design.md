# security09 CORS設定ミス体験 基本設計
## 0. 関連要件

- `../requirements/security09_cors_misconfiguration_requirements.md`

## 1. 設計目的
CORSの許可しすぎ・拒否しすぎ・credentials併用の注意点を確認する。
## 2. 対象範囲

- allowed origin
- wildcard
- credentials
- preflight
- StudyWeb CORS基礎との差分
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security09_file_upload/
  README.md
  app/
  docs/cors_policy_table.md
  docs/misconfiguration_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| origin | 許可・未許可origin |
| credentials | Cookieあり・なし |
| policy | limited / wildcard |

## 5. 出力
| 出力 | 内容 |
|---|---|
| allowed response | 許可時 |
| blocked response | 拒否時 |
| notes | 設定ミスリスク |

## 6. 処理方針
1. 許可origin限定を確認する
2. wildcardの危険性を説明する
3. credentialsとの関係を確認する
4. 本番全許可を避ける方針を示す
## 7. 確認観点

- StudyWebのCORS基礎と重複しすぎていないか
- 本番でorigin限定が必要と説明できるか
- Cookieあり通信の注意を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、policy分類、確認パターン、注意メモを定義する。
