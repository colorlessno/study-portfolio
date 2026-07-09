# web27 詳細設計## Nginx 静的配信 + APIリバースプロキシ

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web27_nginx_static_reverse_proxy/api/ and src/frontend/static/studyweb/systems/web27_nginx_static_reverse_proxy/web/ and src/infra/nginx/web27_nginx_static_reverse_proxy/ and src/infra/compose/web27_nginx_static_reverse_proxy/
├── docker-compose.yml
├── nginx/
│  └── default.conf
├── web/
│  ├── index.html
│  └── style.css
├── api/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| Nginx | 静的配信/転送| root, proxy_pass |
| web | HTML/CSS | 表示 |
| api | JSON応答| `/health` |
| compose | 起動| nginx/api |

## 3. API 詳細

| パス | 転の | 処理|
|---|---|---|
| `/` | Nginx static | index.html |
| `/api/health` | API service | health JSON |

## 4. 詳細API I/O 定義

| 入力| 処理| 出力|
|---|---|---|
| GET `/` | static file | HTML |
| GET `/api/*` | proxy_pass | API response |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| nginx config | 構文OK |
| proxy_pass | service名正しい |
| static root | index.html存在 |

## 6. エラー応答仕様
| error_code | HTTP | 発生条件 |
|---|---|---|
| `static_not_found` | 404 | ファイルない|
| `bad_gateway` | 502 | API転送不可 |
| `nginx_config_error` | 起動失敗| 設定不正 |

## 7. バリデーション一覧

| 対象 | 確認|
|---|---|
| Nginx | 起動する|
| `/` | HTML表示 |
| `/api/health` | API JSON |

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- Nginx access/error log を確認する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `location /api/` のパス書き換え有無をREADMEに明記する
- HTTPS/TLSは対象外
