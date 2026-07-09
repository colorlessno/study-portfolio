# security13 ローカルHTTPS 要件定義

## 1. 目的

ローカルHTTPS、自己署名証明書、ブラウザ警告、HTTPとの差を学ぶ。

## 2. 学習対象

- HTTPS
- TLS
- self-signed certificate
- browser warning
- secure cookie

## 3. 作成する成果物

- ローカルHTTPSサンプル
- 自己署名証明書メモ
- ブラウザ警告確認手順
- HTTP/HTTPS比較表

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | HTTPとHTTPSの違いを説明できる |
| FR-02 | 自己署名証明書の警告を確認できる |
| FR-03 | Secure CookieがHTTPS前提であることを説明できる |
| FR-04 | 本番では信頼済み証明書が必要と説明できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | ローカル学習用途に限定する |
| NFR-02 | 証明書ファイルを誤って公開しない |
| NFR-03 | ブラウザ警告を無視する運用にしない |

## 6. 対象外

- 本番証明書取得
- Let's Encrypt自動更新
- Nginx HTTPS終端

## 7. 受入条件

- HTTPSの目的を説明できる
- 自己署名証明書の警告理由を説明できる
- Secure CookieとHTTPSの関係を説明できる

## 8. 学習観点

- HTTPSは通信の盗聴・改ざん対策
- 証明書は相手の正当性確認に関わる
- 自己署名は学習用と割り切る
