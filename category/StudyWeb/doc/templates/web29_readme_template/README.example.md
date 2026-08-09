# web20_create_task_form

ReactのフォームからNestJS APIへタスクを登録し、PostgreSQLへ保存する学習サンプルです。

## このテーマでできるようになること

- フォーム入力をReactのstateで管理できる
- JSONをPOSTし、APIのレスポンスとHTTPステータスを確認できる
- APIからPrismaを通してPostgreSQLへ保存する流れを説明できる
- 画面、Network、APIログ、DBのどこで失敗したかを切り分けられる

## 前提

- Node.js、npm、Docker、Docker Composeを使用できる
- `web19_fetch_task_list` 相当の一覧取得を確認済み
- ローカル学習用のDBを起動できる

## 使用技術

- フロントエンド: React / Vite / TypeScript
- バックエンド: NestJS / Prisma
- データベース: PostgreSQL
- 実行環境: Docker Compose

## 構成

```text
src/frontend/src/studyweb/systems/web20_create_task_form/frontend/
src/backend/src/studyweb/systems/web20_create_task_form/backend/
src/infra/compose/web20_create_task_form/docker-compose.yml
```

## 最短実行

```powershell
Set-Location src/infra/compose/web20_create_task_form
docker compose up --build
```

- 画面: `http://localhost:5180`
- API: `http://localhost:13020/tasks`

確認後は `docker compose down` で停止します。Volumeを削除する場合は、学習データが不要であることを確認してから実行します。

## 確認する流れ

1. 画面にタスク名を入力する。
2. 送信前に、発生するHTTPメソッド、URL、ステータスを予想する。
3. 登録ボタンを押す。
4. DevToolsのNetworkで `POST /tasks` のrequestとresponseを確認する。
5. 一覧へ新しいタスクが反映されることを確認する。
6. APIログまたはDBで、データが保存されたことを確認する。

## コードを読む順番

1. フォームコンポーネントのstateとsubmit handler
2. API clientのURL、method、request body
3. NestJS ControllerのPOST endpoint
4. Serviceの入力処理
5. PrismaによるDB保存
6. 成功後の一覧更新とエラー表示

## 壊して直す演習

- API URLを一時的に変更し、Network errorの見え方を確認する
- 必須項目を空にし、画面とAPIのどちらで拒否されるか確認する
- APIを停止してから送信し、画面のエラー表示を確認する
- 同じ内容を連続送信し、二重登録への対策を検討する

## 自分の言葉で説明する

- 送信ボタンを押してからDBへ保存されるまでの流れ
- 画面側とAPI側の両方で入力検証が必要な理由
- 成功後に一覧を更新する方法と、それぞれの利点
- 本番利用で認証、CSRF対策、重複送信対策が必要になる理由

## 詰まった点

| 問題 | 原因の仮説 | 確認方法 | 対処 |
|---|---|---|---|
| CORSエラー | API側の許可設定不足 | Networkのresponse headerとAPI設定を比較 | 許可するoriginを限定して設定する |

## 学習完了の目安

- レベル1（再現）: タスクを登録して一覧へ反映できる
- レベル2（説明）: 画面、API、Prisma、DBの処理を順に説明できる
- レベル3（改造）: 入力検証または削除機能を追加し、テスト観点を説明できる

## 注意

実際のDBパスワードやAPIキーをREADMEへ記載しません。ローカル学習用の既定値と、本番用の秘密情報管理を区別します。
