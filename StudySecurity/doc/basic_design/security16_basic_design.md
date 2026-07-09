# security16 監査ログ 基本設計
## 0. 関連要件

- `../requirements/security16_audit_log_requirements.md`

## 1. 設計目的
誰が、いつ、何をしたかを記録する監査ログの基本を確認する。
## 2. 対象範囲

- actor
- action
- target
- timestamp
- request id
- secret redaction

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security16_dependency_management/
  README.md
  app/
  docs/audit_log_schema.md
  docs/log_safety_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| operation | login/update/delete |
| actor | 学習用ユーザー |
| target | 操作対象 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| audit log | actor/action/target/time |
| request id | 追跡ID |
| safe log | secretを含まないログ |

## 6. 処理方針
1. 操作時に監査ログを記録する
2. request idを付ける
3. secretやtokenをログに出さない
4. 操作履歴を確認できるようにする

## 7. 確認観点

- 誰が何をしたか追跡できるか
- 秘密情報がログに出ていないか
- デバッグログとの違いを説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、ログschema、操作API、確認手順を定義する。
