# StudyWeb

StudyWeb は、Web開発の基礎から業務Web、API、Docker、ファイル取込、非同期処理、DB性能確認までを段階的に学ぶための実装群です。

## 構成方針

```text
StudyWeb/
  src/frontend/src/studyweb/systems/
  src/backend/src/studyweb/systems/
  infra/
  samples/
  doc/requirements/
  doc/basic_design/
  doc/detailed_design/
  doc/learning_notes/
  doc/templates/
  doc/reviews/
```

Batch 1 では `web01-web06` の静的実装を `src/frontend/src/studyweb/systems/` に移し、`web29-web31` の資料・テンプレートを `doc/learning_notes/` と `doc/templates/` に移した。

## Batch 1 確認例

```powershell
Get-ChildItem .\src\frontend\src\studyweb\systems\web01_static_first_page
Get-ChildItem .\doc\templates\web31_issue_pr_style
```

以降の番号フォルダは、分類表に基づいてバッチ単位で移行する。


## データベース接続情報について

一部のサンプル（`web16` 以降の Prisma / PostgreSQL 系）の `docker-compose.yml` には、接続情報として `postgres / postgres` が含まれます。これは**ローカル開発・学習用の慣例的なデフォルト値**です。本番等で利用する場合は `.env` や環境変数（`POSTGRES_PASSWORD` / `DATABASE_URL` 等）で必ず上書きしてください。
## 文書完結型テーマについて

`web29`（README テンプレート）、`web30`（エラーログノート）、`web31`（Issue/PR スタイル）、`web52`（レンダリング方式比較）は、詳細設計の製造対象を**コードではなく文書**（`doc/learning_notes/` 配下）として定義した文書完結型テーマです。これらに対応するコードが `src/` に無いのは意図した構成です。
