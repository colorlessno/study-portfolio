# web18 基本設計
## Seed と Migration

---

## 1. システム構成設計

### 1.1 全体構成

```text
開発者
  ↓
Prisma CLI
  ├─ migrate
  └─ seed
      ↓
PostgreSQL（Docker Compose）
```

### 1.2 コンポーネント一覧

| コンポーネント | 役割 |
|---|---|
| `schema.prisma` | DBモデル定義 |
| `migrations/` | DB構造変更履歴 |
| `seed.ts` | 初期データ投入 |
| `docker-compose.yml` | PostgreSQL 起動 |
| `.env` | DB接続情報 |

---

## 2. 主要設計方針

### 2.1 Migration方針

- DB構造は Prisma schema から migration で作成する
- 手作業でテーブルを作らない
- migration ファイルを成果物として残す

### 2.2 Seed方針

- 開発確認用の初期データを投入する
- 再実行しても扱いやすいよう upsert または削除後投入を検討する
- 本番データではなく学習用データとして扱う

---

## 3. IF仕様

### 3.1 CLI IF

| コマンド | 役割 |
|---|---|
| `prisma migrate dev` | migration 作成・実行 |
| `prisma db seed` | seed 実行 |
| `prisma studio` | データ確認 |

### 3.2 設定IF

| 項目 | 内容 |
|---|---|
| `DATABASE_URL` | PostgreSQL接続文字列 |

---

## 4. 処理フロー

```text
PostgreSQL起動
  ↓
DATABASE_URL設定
  ↓
prisma migrate dev
  ↓
テーブル作成
  ↓
prisma db seed
  ↓
初期データ投入
  ↓
Prisma Studioで確認
```

---

## 5. データ設計

モデルは学習用に Task または Category + Task を定義する。

| データ | 用途 |
|---|---|
| Task | seed確認用の基本データ |
| Category | relation確認用の任意データ |

---

## 6. プロンプト・AI制御設計

AI処理は使用しない。

---

## 7. ガードレール・エラー処理設計

- migration 実行前に DB が起動していることを確認する
- `DATABASE_URL` 不備時の確認手順を README に記載する
- seed の重複投入を避ける方針を明記する

---

## 8. 非機能・運用設計

- Docker Compose でDBを再現できる
- 初期データ投入手順をREADMEに明記する
- 本番移行手順は対象外とする

---

## 9. 技術スタック

| 用途 | 技術 |
|---|---|
| ORM/CLI | Prisma |
| DB | PostgreSQL |
| Seed | TypeScript |
| コンテナ | Docker Compose |

---

## 10. 画面一覧

アプリ画面は持たない。Prisma Studio は確認用ツールとして扱う。

---

## 11. 権限制御

認証・認可は扱わない。

---

## 12. 主要導線

| 導線 | 内容 |
|---|---|
| DB起動 | Docker Compose |
| 構造反映 | migration |
| 初期投入 | seed |
| 確認 | Prisma Studio |

---

## 13. 画面遷移図

画面遷移はない。

---

## 14. 画面項目定義

画面項目はない。DB項目はデータ設計に記載する。

---

## 15. シーケンス図

```text
開発者 -> Docker: PostgreSQL起動
開発者 -> Prisma CLI: migrate dev
Prisma CLI -> PostgreSQL: DDL実行
開発者 -> Prisma CLI: db seed
Prisma CLI -> PostgreSQL: 初期データ投入
```
