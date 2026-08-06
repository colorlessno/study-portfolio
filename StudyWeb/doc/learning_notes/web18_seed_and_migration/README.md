# web18 SeedとMigration

Docker Compose、PostgreSQL、Prismaを使い、DB構造の変更履歴と再実行可能な初期データ投入を学ぶテーマです。

## このテーマでできるようになること

- Prisma schemaからMigrationを作成・適用できる
- MigrationとSeedの役割を区別できる
- 1対多relationをPrismaモデルで説明できる
- Seedを再実行し、データが増殖しないことを確認できる

## 関連資料

1. [要件定義](../../requirements/web18_seed_and_migration_requirements.md)
2. [基本設計](../../basic_design/web18_basic_design.md)
3. [詳細設計](../../detailed_design/web18_detailed_design.md)
4. [Prisma schema](../../../src/backend/src/studyweb/systems/web18_seed_and_migration/prisma/schema.prisma)
5. [Seed実装](../../../src/backend/src/studyweb/systems/web18_seed_and_migration/prisma/seed.ts)

## 事前条件

- Docker Desktop等のDocker Engineが起動していること
- ホストの15418番ポートが利用できること
- 実行対象が学習用DBであること

Seedは既存Taskを`deleteMany()`で削除してから2件を投入します。保持したいDBへは実行しないでください。

## 資料を見る前の確認問題

- MigrationとSeedは、それぞれ何を変更しますか。
- CategoryとTaskの1対多は、どちらが外部キーを持ちますか。
- Seedを2回実行しても件数を増やさない方法は何ですか。

## 15分で再開する

1. Docker Engineの起動を確認する。
2. `db`を起動してhealthyを待つ。
3. MigrationとSeedを順に実行する。
4. `schema.prisma`と`seed.ts`で、作られた構造とデータを照合する。

## 実行方法

実装ディレクトリで実行します。

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose run --rm seed
```

状態とログは次で確認します。

```bash
docker compose ps
docker compose logs db
```

作業終了時はvolumeを削除せず、`docker compose down`で停止します。

## Prisma Studio

ホストの5555番へ公開して起動します。

```bash
docker compose run --rm -p 5555:5555 seed npx prisma studio --hostname 0.0.0.0
```

ブラウザで`http://localhost:5555`を開きます。

## コードを読む順番

1. `.env.example`でDATABASE_URLの構造を見る。
2. `docker-compose.yml`でdb、migrate、seedの依存関係を見る。
3. `schema.prisma`でCategoryとTaskのrelationを見る。
4. `seed.ts`でCategoryのupsert、Taskの削除・作成を見る。
5. `package.json`でPrismaのSeed設定を見る。

## 観察ポイント

- dbがhealthyになってからmigrateとseedが動くか
- Migration実行後に`prisma/migrations/`が生成されるか
- CategoryがFrontendとBackendの2件か
- Taskが2件で、それぞれ正しいCategoryを参照するか
- Seedを再実行しても件数が増えないか
- Seed失敗時に終了コードが成功扱いにならないか

## 壊して直す演習

1. DATABASE_URLのDB名を一時的に誤らせ、接続エラーの読み方を確認する。
2. `schema.prisma`のrelationフィールド名を一時的に変え、Prismaの検証エラーを見る。
3. `deleteMany()`を実行する理由を考え、実際には外さずに増殖条件を説明する。
4. dbを停止した状態でSeedを開始し、depends_onとhealthcheckの役割を確認する。

## 自分の言葉で説明する

- Migration、Seed、Prisma Studioをそれぞれ1文で説明してください。
- Categoryはupsert、Taskは全削除後に作成している理由は何ですか。
- 学習用DBのSeedを本番DBへ実行してはいけない理由は何ですか。

## うまく動かないとき

- Dockerへ接続できない場合は、Docker Engineの起動を確認します。
- dbがhealthyにならない場合は、`docker compose logs db`を確認します。
- Prisma接続エラーでは、コンテナ内のhostが`db`であることを確認します。
- 15418または5555が競合する場合は、使用中プロセスとポート設定を確認します。

## 学習完了の目安

- [ ] MigrationとSeedを順番に完了した
- [ ] relationをPrisma StudioまたはDBで確認した
- [ ] Seedを2回実行して件数が増えないことを確認した
- [ ] MigrationとSeedの違いを説明できた
