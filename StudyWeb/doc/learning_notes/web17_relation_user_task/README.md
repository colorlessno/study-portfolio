# web17 UserとTaskのrelation

PrismaでUserとTaskの1対多relationを定義し、関連データを含む作成・取得を学ぶテーマです。

## このテーマでできるようになること

- 1対多relationと外部キーの位置を説明できる
- Userを作成して、そのIDをTaskへ関連付けられる
- Prismaの`include`で関連データを取得できる
- 存在しない親IDをAPIで404にできる

## 関連資料

1. [要件定義](../../requirements/web17_relation_user_task_requirements.md)
2. [基本設計](../../basic_design/web17_basic_design.md)
3. [詳細設計](../../detailed_design/web17_detailed_design.md)
4. [Prisma schema](../../../src/backend/src/studyweb/systems/web17_relation_user_task/prisma/schema.prisma)
5. [UsersService](../../../src/backend/src/studyweb/systems/web17_relation_user_task/src/users/users.service.ts)
6. [TasksService](../../../src/backend/src/studyweb/systems/web17_relation_user_task/src/tasks/tasks.service.ts)

## 事前条件

- Docker Engineが起動していること
- 13017番と15417番が利用できること
- 確認用メールアドレスは実行ごとに重複しないこと

## 資料を見る前の確認問題

- User 1件にTask複数件を関連付ける場合、外部キーはどちらに置きますか。
- Userを削除した場合のTaskをどう扱うか、現schemaから判断できますか。
- `include`と、別リクエストで後から取得する方法は何が違いますか。

## 15分で再開する

1. DB、Migration、backendを起動する。
2. Userを1件作成し、IDを控える。
3. そのIDでTaskを1件作成する。
4. `/users`と`/tasks`でrelationの両方向を確認する。

## 起動方法

`StudyWeb/src/backend/src/studyweb/systems/web17_relation_user_task`で実行します。

```bash
docker compose up -d db
docker compose run --rm migrate
docker compose up -d backend
```

## 確認コマンド

```powershell
curl.exe -i -X POST http://localhost:13017/users -H "Content-Type: application/json" -d "{\"name\":\"Learner\",\"email\":\"learner@example.com\"}"
curl.exe -i -X POST http://localhost:13017/tasks -H "Content-Type: application/json" -d "{\"title\":\"relation確認\",\"userId\":\"USER_ID\"}"
curl.exe -i http://localhost:13017/users
curl.exe -i http://localhost:13017/tasks
```

`USER_ID`はUser作成結果のidへ置き換えます。既に同じemailがある場合は別の値を使用します。

## コードを読む順番

1. `schema.prisma`でUser、Task、userId、relationを見る。
2. UserとTaskのDTOで入力項目を見る。
3. UsersServiceの`include: { tasks: true }`を見る。
4. TasksServiceの親User存在確認を見る。
5. Task作成・一覧の`include: { user: true }`を見る。

## 観察ポイント

- Userレスポンスにtasks配列が含まれるか
- Taskレスポンスにuser objectが含まれるか
- 同じUserへTaskを複数作成できるか
- 存在しないuserIdでTaskを作ると404になるか
- 不正なemailが400になるか
- 同じemailの再作成がDBのunique制約に触れるか

## 壊して直す演習

1. Task作成前のUser存在確認を一時的に外し、外部キーエラーとの差を見る。
2. findAllの`include`を外し、APIレスポンスがどう変わるか確認する。
3. CreateUserDtoの`@IsEmail()`を外し、API検証とDB制約の違いを見る。
4. 存在しないUser IDでTaskを作成し、404文言を確認する。

## 自分の言葉で説明する

- UserとTaskの1対多を、主キーと外部キーを使って説明してください。
- Task作成前にUserを検索する理由は何ですか。
- `include`を常に使う場合の利点とデータ量の注意点は何ですか。

## うまく動かないとき

- Task作成が404なら、User IDを作成レスポンスから再取得します。
- User作成が失敗する場合はemail形式と重複を確認します。
- relationが含まれない場合はServiceの`include`を確認します。

## 学習完了の目安

- [ ] User 1件へTaskを2件以上関連付けた
- [ ] User側とTask側のincludeを確認した
- [ ] 不正emailと存在しないuserIdを確認した
- [ ] 外部キーの位置を図で説明できた
