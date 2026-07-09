# security14 Nginx HTTPS終端 要件定義

## 1. 目的

NginxでHTTPSを受け、backendへreverse proxyする基本構成を学ぶ。

## 2. 学習対象

- TLS termination
- reverse proxy
- upstream
- security header
- backendを直接公開しない構成

## 3. 作成する成果物

- Nginx HTTPS終端構成メモ
- reverse proxy設定例
- backend接続図
- 確認手順

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | NginxがHTTPSを受ける構成を説明できる |
| FR-02 | `/api` をbackendへ転送する構成を説明できる |
| FR-03 | backendを外部公開しない理由を説明できる |
| FR-04 | HTTPからHTTPSへのredirect方針を説明できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | 学習用設定と本番設定の差を明記する |
| NFR-02 | 秘密鍵をリポジトリに入れない |
| NFR-03 | TLS設定の詳細は深入りしすぎない |

## 6. 対象外

- 本番証明書運用
- Let’s Encrypt自動更新
- WAF

## 7. 受入条件

- HTTPS終端とreverse proxyの役割を説明できる
- backendを直接公開しない理由を説明できる
- 証明書と秘密鍵の保護を説明できる

## 8. 学習観点

- 公開入口と内部サービスを分ける
- TLS秘密鍵は厳重に扱う
- Nginxは配信だけでなく境界にもなる
