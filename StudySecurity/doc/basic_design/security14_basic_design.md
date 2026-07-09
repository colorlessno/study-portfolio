# security14 Nginx HTTPS終端 基本設計
## 0. 関連要件

- `../requirements/security14_nginx_https_termination_requirements.md`

## 1. 設計目的
NginxでHTTPS終端し、backendへreverse proxyする構成を理解する。
## 2. 対象範囲

- TLS termination
- reverse proxy
- `/api` proxy
- backend非公開
- 設定例
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security14_cors/
  README.md
  nginx/
  docs/architecture.md
  docs/nginx_config_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| request | HTTPS request |
| path | `/` と `/api` |
| certificate | ダミー配置説明 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| static response | Nginx配信 |
| proxied response | backend応答 |
| notes | 終端と内部転送の説明 |

## 6. 処理方針
1. Nginxが公開入口になる構成を示す
2. `/api` をbackendへ転送する
3. backendを外部公開しない
4. 証明書秘密鍵はサンプルに含めない
## 7. 確認観点

- HTTPS終端の意味を説明できるか
- backendを直接公開しない理由を説明できるか
- 秘密鍵を含んでいないか

## 8. 後続工程への引き継ぎ

詳細設計では、Nginx設定例、構成図、確認手順を定義する。
