# web26 Docker ComposeでWeb・API・DBを接続

React、NestJS、PostgreSQLを別コンテナとして起動し、Docker Composeのservice名、公開ポート、healthcheck、volumeを学ぶテーマです。

## このテーマでできるようになること

- Web・API・DBの依存関係をComposeで表現できる
- ホストのURLとコンテナ間接続先を区別できる
- healthcheck後にAPIを起動できる
- DB初期化SQLと永続volumeの関係を説明できる

## 関連資料

1. [要件定義](../../requirements/web26_docker_compose_web_api_db_requirements.md)
2. [基本設計](../../basic_design/web26_basic_design.md)
3. [詳細設計](../../detailed_design/web26_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web26_docker_compose_web_api_db/docker-compose.yml)
5. [DB初期化SQL](../../../src/infra/db/web26_docker_compose_web_api_db/db/init.sql)
6. [API Controller](../../../src/backend/src/studyweb/systems/web26_docker_compose_web_api_db/backend/src/api.controller.ts)

## 事前条件

- Docker Engineが起動していること
- 5186、13026、15426番が利用できること
- PostgreSQLの既定パスワードはローカル学習用であること

## 15分で再開する

1. Composeを起動する。
2. health、tasks、Webを順に開く。
3. `docker compose ps`で3サービスを確認する。
4. Browser、web、api、dbの接続先を図にする。

## 起動方法

`StudyWeb/src/infra/compose/web26_docker_compose_web_api_db`で実行します。

```bash
docker compose up --build
```

サンプルの環境変数を明示する場合は次を使用します。

```bash
docker compose --env-file ../../env/web26_docker_compose_web_api_db/.env.example up --build
```

| 対象 | URL |
|---|---|
| Web | `http://localhost:5186` |
| API health | `http://localhost:13026/health` |
| API tasks | `http://localhost:13026/tasks` |

## 接続の違い

| 利用者 | 接続先 | 理由 |
|---|---|---|
| Browser | `localhost:5186` | ホストへ公開したWebポート |
| Browser/Web JS | `localhost:13026` | ホストへ公開したAPIポート |
| APIコンテナ | `db:5432` | Composeネットワークのservice名 |

## 観察ポイント

- dbがhealthyになってからapiが起動するか
- `/tasks`がinit.sqlの初期データを返すか
- WebがhealthとtasksをPromise.allで表示するか
- `init.sql`がDB volume初回作成時に実行されるか
- Compose停止・再起動後もvolumeのデータが残るか

既存volumeがある場合、init.sqlを変更しても自動では再実行されません。volume削除はDBデータを失うため、必要性を確認してから別作業として扱います。

## 壊して直す演習

1. VITE_API_URLのポートを誤らせ、WebだけがAPI接続に失敗する様子を見る。
2. DATABASE_URLのhostをlocalhostへ変えず、コンテナ内で`db`が必要な理由を説明する。
3. APIを停止し、Web表示とNetworkを確認する。
4. `docker compose logs api`と`logs db`で障害箇所を切り分ける。

## 自分の言葉で説明する

- Browserのlocalhostとコンテナ内のservice名を説明してください。
- healthcheckとdepends_onは何を保証しますか。
- init.sqlが毎回実行されない理由は何ですか。

## 学習完了の目安

- [ ] Web、health、tasksを確認した
- [ ] 3サービスと接続先を図にした
- [ ] API停止時のログを確認した
- [ ] volumeと初期化SQLの関係を説明した
