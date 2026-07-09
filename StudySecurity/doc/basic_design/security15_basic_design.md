# security15 セキュリティヘッダー 基本設計
## 0. 関連要件

- `../requirements/security15_security_headers_requirements.md`

## 1. 設計目的
主要セキュリティヘッダーを付与し、DevToolsで確認する。
## 2. 対象範囲

- CSP
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security15_security_headers/
  README.md
  app/
  docs/header_table.md
  docs/devtools_check.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| request | サンプルページ |
| header policy | 学習用header設定 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| response headers | 主要セキュリティヘッダー |
| header table | 意味と注意 |

## 6. 処理方針
1. responseにheaderを付与する
2. DevToolsで確認する
3. 各headerの役割を表にする
4. HSTSなど本番注意が必要なものを明記する
## 7. 確認観点

- headerの意味を説明できるか
- headerだけで全て防げると誤解していないか
- HSTSの注意点を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、header値、API、確認手順、注意表を定義する。
