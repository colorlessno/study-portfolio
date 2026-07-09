# web18 詳細設計## Seed と Migration

---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web18_seed_and_migration/
├── docker-compose.yml
├── package.json
├── .env.example
├── prisma/
│  ├── schema.prisma
│  ├── seed.ts
│  └── migrations/
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| schema.prisma | モデル定義 | Task/Category応答|
| migrations | 構造変更履歴 | SQL生成物 |
| seed.ts | 初期データ投入 | upsert/delete+create |
| Docker Compose | DB起動| PostgreSQL |

## 3. API 詳細

HTTP API は使用しないPrisma CLI を操作IFとして扱い
| コマンテ| 処理|
|---|---|
| `prisma migrate dev` | migration成・実行|
| `prisma db seed` | 初期データ投入 |
| `prisma studio` | データ確認|

## 4. 詳細API I/O 定義

| 入力| 内容|
|---|---|
| `DATABASE_URL` | DB接続文列 |
| `schema.prisma` | DB構造定義 |
| `seed.ts` | 初期データ |

| 出力| 内容|
|---|---|
| migrations | DB変更履歴 |
| tables | DBテーブル |
| seed data | 初期データ |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| DATABASE_URL | PostgreSQLへ接続可能 |
| schema | Prisma構文エラーない|
| seed | 再実行時に重複壊れない|
| seed data | 複数件 | 2件以の初期データを投入する |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `db_not_ready` | DB未起動| Docker確認|
| `migration_failed` | migration失敗| schema確認|
| `seed_failed` | seed失敗| データ重複接続確認|

## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| migration | 成功終了|
| seed | 初期データい件以上投入される|
| studio | データ閲覧可能 |

## 8. データベース詳細

学習用モデルとして Task または Category + Task を定義する。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- migration/seed の失敗ログをターミナルで確認する
- 本番移行や監査ログは扱わない
## 11. DDL

DDLはPrisma migrationにより成される。果物には `prisma/migrations/` を含める。
## 12. 実装メモ

- `package.json` に seed 設定を追加する
- README に migrate -> seed -> studio の項目を書い
