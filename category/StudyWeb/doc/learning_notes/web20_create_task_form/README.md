# web20 ReactフォームからTaskをDB保存

ReactフォームからNestJS APIへPOSTし、PrismaとPostgreSQLへTaskを保存して一覧を再取得するテーマです。

## このテーマでできるようになること

- controlled inputからJSON bodyを作成できる
- フロントとAPIの両方で必須入力を検証できる
- POST成功後に入力を消し、一覧を再取得できる
- BrowserからDBまでのデータ経路を説明できる

## 関連資料

1. [要件定義](../../requirements/web20_create_task_form_requirements.md)
2. [基本設計](../../basic_design/web20_basic_design.md)
3. [詳細設計](../../detailed_design/web20_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web20_create_task_form/docker-compose.yml)
5. [React App](../../../src/frontend/src/studyweb/systems/web20_create_task_form/frontend/src/App.tsx)
6. [TasksService](../../../src/backend/src/studyweb/systems/web20_create_task_form/backend/src/tasks.service.ts)

## 事前条件

- Docker Engineが起動していること
- 5180、13020、15420番が利用できること
- 実行対象が学習用DBであること

## 15分で再開する

1. DBとMigrationを準備し、全サービスを起動する。
2. 空titleを送信し、フロントのエラーを見る。
3. 正常なtitleを作成し、NetworkのPOSTとGETを見る。
4. 再読み込み後もTaskが残ることを確認する。

## 起動方法

`category/StudyWeb/src/infra/compose/web20_create_task_form`で実行します。

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up --build
```

| 対象 | URL |
|---|---|
| Frontend | `http://localhost:5180` |
| API | `http://localhost:13020/tasks` |

## コードを読む順番

1. Composeでfrontend、backend、db、migrateの関係を見る。
2. Prisma schemaでTaskの保存項目を見る。
3. DTO、Controller、ServiceでPOST処理を見る。
4. React Appでtitle stateとhandleSubmitを見る。
5. POST成功後の`setTitle("")`と`loadTasks()`を見る。

## データの流れ

```text
inputのtitle state
  ↓ JSON POST
NestJS DTO
  ↓ Service
Prisma
  ↓
PostgreSQL
  ↓ GET再取得
React一覧
```

## 観察ポイント

- 空文字と空白だけのtitleがフロントで止まるか
- 正常時のPOSTが201、再取得GETが200になるか
- 保存後に入力欄が空になるか
- 新しいTaskが一覧先頭へ出るか
- ページ再読み込み後もDBのTaskが表示されるか
- APIへ直接空titleや101文字を送ると400になるか

## 壊して直す演習

1. フロントの`title.trim()`判定を一時的に外し、API側検証が残ることを確認する。
2. `setTitle("")`を外し、保存後のUI差を見る。
3. POST後の`loadTasks()`を外し、DBと画面表示がずれる様子を見る。
4. backendを停止し、初期GETとPOSTで表示されるエラーの違いを見る。

## 自分の言葉で説明する

- フロントとAPIで二重に検証する理由は何ですか。
- POST成功後にGETを再実行する理由は何ですか。
- web19の固定配列とweb20のDB保存は何が違いますか。

## うまく動かないとき

- Migration未実行の場合はbackendログとDBテーブルを確認します。
- POSTが400ならNetworkのRequest PayloadとDTO制約を確認します。
- 保存されたのに画面へ出ない場合は、POST後のGETとReact stateを確認します。

## 学習完了の目安

- [ ] 空入力と正常作成を確認した
- [ ] POST後のGET再取得をNetworkで確認した
- [ ] 再読み込み後の永続化を確認した
- [ ] BrowserからDBまでの流れを図にした
