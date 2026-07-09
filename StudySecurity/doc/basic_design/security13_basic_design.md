# security13 ローカルHTTPS 基本設計
## 0. 関連要件

- `../requirements/security13_local_https_requirements.md`

## 1. 設計目的
ローカルHTTPSと自己署名証明書の警告、HTTPとの差を確認する。
## 2. 対象範囲

- HTTP / HTTPS
- self-signed certificate
- browser warning
- Secure Cookie
- 学習用証明書方針
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security13_rate_limit/
  README.md
  app/
  docs/http_https_compare.md
  docs/self_signed_warning.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| request | HTTP / HTTPS |
| certificate | 学習用自己署名証明書の説明 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| compare note | HTTP/HTTPS差分 |
| warning note | ブラウザ警告 |
| cookie note | Secure Cookie |

## 6. 処理方針
1. HTTPとHTTPSの違いを整理する
2. 自己署名証明書の警告を説明する
3. Secure Cookieとの関係を整理する
4. 証明書秘密鍵をリポジトリに入れない
## 7. 確認観点

- 自己署名を本番扱いしていないか
- 秘密鍵を保存していないか
- ブラウザ警告の意味を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、確認手順、証明書の扱い、比較表を定義する。
