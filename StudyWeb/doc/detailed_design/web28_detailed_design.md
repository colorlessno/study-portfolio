# web28 詳細設計## .env による設定のり替い
---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web28_env_config/backend/ and src/frontend/src/studyweb/systems/web28_env_config/frontend/ and src/infra/compose/web28_env_config/ and src/infra/env/web28_env_config/
├── docker-compose.yml
├── .env.example
├── frontend/
├── backend/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な設定|
|---|---|---|
| `.env.example` | 設定見本 | ダミー値 |
| compose | env読込 | ports/environment |
| frontend | API URL参照 | `VITE_API_URL` 応答|
| backend | DB/port参照 | `DATABASE_URL`, `PORT` |

## 3. API 詳細

設定確認用に `GET /config-check` または `GET /health` を用意する。
## 4. 詳細API I/O 定義

| 環境変数 | 利用先 | 説明 |
|---|---|---|
| `FRONTEND_PORT` | compose | Web公のーテ|
| `API_PORT` | backend/compose | APIポーテ|
| `VITE_API_URL` | frontend | API接続の |
| `DATABASE_URL` | backend | DB接続|

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| 必須nv | 未設定なら起動時エラー |
| API URL | URL形式|
| port | 数値 |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `env_missing` | 必須nvない| `.env`確認|
| `invalid_port` | port不正 | 数値へ修正 |
| `api_url_invalid` | URL不正 | env修正 |

## 7. バリデーション一覧

| 対象 | 確認|
|---|---|
| `.env.example` | 秘密報ない|
| `.env` | Git管理象外|
| frontend env | 公開可能値のみ |

## 8. データベース詳細

DB利用時の `DATABASE_URL` で接続する。スキーマのの主題ではない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- 起動時に設定不足がわかるログを出す
- 秘密情報をログに出さない
## 11. DDL

DBスキーマの対象外。DLは定義しない
## 12. 実装メモ

- README に `.env.example` から `.env` を作る手順を書く
- フロントの env prefix ルールを説明する
