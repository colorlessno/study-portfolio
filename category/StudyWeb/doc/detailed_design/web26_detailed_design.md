# web26 詳細設計## Docker Compose Web + API + DB

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web26_docker_compose_web_api_db/backend/ and src/frontend/src/studyweb/systems/web26_docker_compose_web_api_db/frontend/ and src/infra/compose/web26_docker_compose_web_api_db/ and src/infra/db/web26_docker_compose_web_api_db/
├── docker-compose.yml
├── .env.example
├── frontend/
│  └── Dockerfile
├── backend/
│  └── Dockerfile
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| web service | フロント表示 | API呼び出い|
| api service | API提例| health/tasks |
| db service | PostgreSQL | データ保持 |
| compose | 起動定義 | network/volume/env |

## 3. API 詳細

| メソッド| パス | 役割 |
|---|---|---|
| GET | `/health` | API起動確認|
| GET | `/tasks` | DB/API接続確認|

## 4. 詳細API I/O 定義

| サービス | 入力| 出力|
|---|---|---|
| web | API URL | 画面表示 |
| api | DATABASE_URL | JSON |
| db | SQL接続| rows |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| 環境変数 | 必要な値が設定済み |
| ポーテ| 競合ない|
| DB | apiから接続可能 |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `port_conflict` | ポート使用中 | `.env`変更 |
| `db_connection_failed` | DB未接続| compose/log確認|
| `api_unreachable` | webからapi不可 | service各CORS確認|

## 7. バリデーション一覧

| 対象 | 確認|
|---|---|
| compose | `docker compose config` |
| services | `docker compose ps` |
| logs | `docker compose logs` |

## 8. データベース詳細

PostgreSQLを使用する。接続確認用の `tasks` テーブルを用意し、API から `GET /tasks` で取得できるようにする。
| カラム | 型| 備考|
|---|---|---|
| `id` | serial | PK |
| `title` | varchar(100) | 接続確認用タイトル |
| `created_at` | timestamp | 成日時|

## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- サービスごとのログを確認する
- 本番監査ログは扱わない
## 11. DDL

```sql
CREATE TABLE tasks (
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## 12. 実装メモ

- service名でコンテナ間通信する
- DB volume を定義する
- README に起動停止/ログ確認を記載する
