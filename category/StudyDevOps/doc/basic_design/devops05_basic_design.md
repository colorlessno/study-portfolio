# devops05 基本設計

## DB付きCI

## 1. 設計目的

DB service、migration、seed、test を一連で実行し、DB を含む CI / ローカル検証の順序を学べる教材にする。

## 2. 配置方針

```text
category/StudyDevOps/
  src/apps/devops05_db_ci/
    README.md
    app/
      package.json
      src/
    db/
      schema.sql
      seed.sql
    tests/
      db.test.js
    docker-compose.yml
```

- PostgreSQL を Docker Compose で起動する。
- 本番DBは使わず、test database のみ扱う。
- 作成・更新するテキストファイルは UTF-8 BOMなしとする。

## 3. 全体フロー

```text
db start -> wait healthy -> schema apply -> seed -> app/test execute -> logs review
```

## 4. コンポーネント

| コンポーネント | 役割 |
|---|---|
| `db/schema.sql` | table 定義 |
| `db/seed.sql` | test data |
| `app/src/` | DB に接続する最小の処理 |
| `tests/db.test.js` | DB 接続と query result を確認する |
| `docker-compose.yml` | db と test runner を定義する |

## 5. Docker / CI 方針

- Compose の healthcheck で DB 起動待機を行う。
- migration / seed / test の順序を script 化する。
- DB 接続情報は `.env.example` にダミーで記載し、secret は含めない。
- secrets は使わず、test database の認証情報も教材用の固定ダミー値に限定する。

## 6. 後続工程への引き継ぎ

詳細設計では、DB schema、seed、接続設定、healthcheck、test case、失敗時 logs を定義する。
