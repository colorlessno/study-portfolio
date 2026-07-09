# security12 SSH鍵 / JWT署名鍵 基本設計
## 0. 関連要件

- `../requirements/security12_ssh_jwt_keys_requirements.md`

## 1. 設計目的
公開鍵・秘密鍵の役割と、SSH鍵・JWT署名鍵の扱いを整理する。
## 2. 対象範囲

- public/private key
- SSH key
- JWT signing key
- key leakage
- 保管チェックリスト
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security12_audit_log/
  README.md
  docs/key_roles.md
  docs/ssh_key_flow.md
  docs/jwt_signing_key_notes.md
  docs/key_protection_checklist.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| key type | SSH鍵、JWT署名鍵 |
| operation | 登録、署名、検証、失効 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| role note | 公開鍵・秘密鍵の役割 |
| checklist | 保護観点 |
| leak response | 漏洩時対応 |

## 6. 処理方針
1. 公開鍵と秘密鍵の役割を整理する
2. SSH公開鍵登録の流れを説明する
3. JWT署名鍵漏洩リスクを説明する
4. 実秘密鍵は作成しない
## 7. 確認観点

- 秘密鍵を共有していないか
- サンプルがダミー表記か
- 漏洩時に再発行が必要と説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、メモ構成、図、チェックリスト項目を定義する。
