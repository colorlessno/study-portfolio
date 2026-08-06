# StudyWeb

StudyWeb は、Web開発の基礎から業務Web、API、Docker、ファイル取込、非同期処理、DB性能確認までを段階的に学ぶための実装群です。

## 構成方針

```text
StudyWeb/
  src/frontend/src/studyweb/systems/
  src/backend/src/studyweb/systems/
  src/infra/
  doc/requirements/
  doc/basic_design/
  doc/detailed_design/
  doc/learning_notes/
  doc/templates/
  doc/reviews/
```

実装は用途に応じてfrontend、backend、infraへ分かれています。テーマごとの `doc/learning_notes/webXX_*/README.md` を入口として、対応する要件、設計、実装を横断します。

## 学習の入口

- [リポジトリ全体の学習再開ガイド](../LEARNING_GUIDE.md)
- [全テーマカタログ](../THEME_CATALOG.md)
- [web01 学習ハブ](./doc/learning_notes/web01_static_first_page/README.md)

Webの基礎から進む場合は、`web01〜06`（HTML / CSS / JavaScript）→ `web07〜12`（React / TypeScript / UI）→ `web13〜22`（API / DB / 通信）→ `web23〜28`（Next.js / Docker / 環境設定）の順が目安です。`web32`以降はHTTP、認証、業務API、性能などを個別に復習できます。


## データベース接続情報について

一部のサンプル（`web16` 以降の Prisma / PostgreSQL 系）の `docker-compose.yml` には、接続情報として `postgres / postgres` が含まれます。これは**ローカル開発・学習用の慣例的なデフォルト値**です。本番等で利用する場合は `.env` や環境変数（`POSTGRES_PASSWORD` / `DATABASE_URL` 等）で必ず上書きしてください。

## 文書完結型テーマについて

`web29`（README テンプレート）、`web30`（エラーログノート）、`web31`（Issue/PR スタイル）、`web52`（レンダリング方式比較）は、詳細設計の製造対象を**コードではなく文書**（`doc/learning_notes/` 配下）として定義した文書完結型テーマです。これらに対応するコードが `src/` に無いのは意図した構成です。
