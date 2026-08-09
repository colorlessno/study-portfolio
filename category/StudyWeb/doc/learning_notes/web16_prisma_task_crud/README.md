# web16 Prisma Task CRUD

NestJS、Prisma、PostgreSQLでTaskの作成・一覧・1件取得・更新・削除を実装し、単一モデルのCRUDを学ぶテーマです。

## このテーマでできるようになること

- HTTPメソッドをCRUD操作へ対応付けられる
- Prisma Clientでcreate、findMany、findUnique、update、deleteを使える
- DTOとValidationPipeで作成・更新入力を制限できる
- 存在しないIDを404として扱える

## 関連資料

1. [要件定義](../../requirements/web16_prisma_task_crud_requirements.md)
2. [基本設計](../../basic_design/web16_basic_design.md)
3. [詳細設計](../../detailed_design/web16_detailed_design.md)
4. [Prisma schema](../../../src/backend/src/studyweb/systems/web16_prisma_task_crud/prisma/schema.prisma)
5. [TasksService](../../../src/backend/src/studyweb/systems/web16_prisma_task_crud/src/tasks/tasks.service.ts)

## 事前条件

- Docker Engineが起動していること
- 13016番と15416番が利用できること
- 実行対象が学習用DBであること

## 資料を見る前の確認問題

- Create、Read、Update、DeleteはどのHTTPメソッドに対応しますか。
- 更新前に`findOne`する理由は何ですか。
- `createdAt`と`updatedAt`は誰が値を設定しますか。

## 15分で再開する

1. DB、Migration、backendを順に起動する。
2. Taskを1件作成し、返されたIDを控える。
3. 一覧取得と1件取得を確認する。
4. doneをtrueへ更新し、最後に削除する。

## 起動方法

`category/StudyWeb/src/backend/src/studyweb/systems/web16_prisma_task_crud`で実行します。

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up -d backend
docker compose ps
```

終了時はvolumeを残して`docker compose down`とします。

## CRUD確認

```powershell
curl.exe -i -X POST http://localhost:13016/tasks -H "Content-Type: application/json" -d "{\"title\":\"Prisma CRUD\"}"
curl.exe -i http://localhost:13016/tasks
curl.exe -i http://localhost:13016/tasks/TASK_ID
curl.exe -i -X PATCH http://localhost:13016/tasks/TASK_ID -H "Content-Type: application/json" -d "{\"done\":true}"
curl.exe -i -X DELETE http://localhost:13016/tasks/TASK_ID
```

`TASK_ID`は作成結果のidへ置き換えます。

## コードを読む順番

1. `prisma/schema.prisma`でTaskモデルと既定値を見る。
2. `src/main.ts`でGlobal ValidationPipeを見る。
3. create/update DTOの必須・任意フィールドを見る。
4. `tasks.controller.ts`でHTTPメソッドとパスを見る。
5. `tasks.service.ts`でPrisma操作と404処理を見る。

## 観察ポイント

- 作成時にid、done=false、createdAt、updatedAtが設定されるか
- 一覧がcreatedAtの降順か
- PATCHで指定したフィールドだけ更新されるか
- 存在しないIDのGET、PATCH、DELETEが404になるか
- titleの101文字以上や未定義フィールドが400になるか
- 削除結果が`deleted: true`とIDを返すか

## 壊して直す演習

1. findAllのorderByをascへ変え、一覧順を比較する。
2. update前の`findOne`を一時的に外し、存在しないIDのエラー形式を比較する。
3. UpdateTaskDtoの`@IsBoolean()`を外し、型検証の役割を見る。
4. DATABASE_URLのDB名を誤らせ、接続エラーを確認する。

## 自分の言葉で説明する

- Controller、Service、Prismaの責務を説明してください。
- POSTとPATCHで異なるDTOを使う理由は何ですか。
- 削除前に存在確認する利点は何ですか。

## うまく動かないとき

- dbがhealthyにならない場合は`docker compose logs db`を確認します。
- backendが起動しない場合はMigrationとDATABASE_URLを確認します。
- 400の場合はJSONの型とDTO制約、404の場合はIDを確認します。

## 学習完了の目安

- [ ] CRUDを1周した
- [ ] 400と404を確認した
- [ ] Prismaの5操作をコード上で対応付けた
- [ ] 終了後にコンテナを停止した
