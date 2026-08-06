# web14 NestJS POST API

NestJSのPOSTルート、DTO、class-validator、Global ValidationPipeを使い、入力を検証してタスク作成風JSONを返すテーマです。DB保存は行いません。

## このテーマでできるようになること

- JSON bodyをDTOとして受け取れる
- デコレーターで必須、型、最大文字数を定義できる
- Global ValidationPipeで未定義フィールドを拒否できる
- 正常系201と入力エラー400を比較できる

## 関連資料

1. [要件定義](../../requirements/web14_nest_post_api_requirements.md)
2. [基本設計](../../basic_design/web14_basic_design.md)
3. [詳細設計](../../detailed_design/web14_detailed_design.md)
4. [DTO実装](../../../src/backend/src/studyweb/systems/web14_nest_post_api/src/tasks/dto/create-task.dto.ts)
5. [Controller実装](../../../src/backend/src/studyweb/systems/web14_nest_post_api/src/tasks/tasks.controller.ts)

## 資料を見る前の確認問題

- TypeScriptの型だけでは、外部から届くJSONを実行時に検証できないのはなぜですか。
- HTTP 201と400はそれぞれ何を示しますか。
- DTOにないフィールドを拒否する利点は何ですか。

## 15分で再開する

1. APIを起動する。
2. titleとdescriptionを送って201を確認する。
3. 空titleを送って400を確認する。
4. DTOとValidationPipeで、その差を作る箇所を探す。

## 起動方法

実装ディレクトリで`npm install`、`npm run start:dev`を実行します。web13等が3000番を使用している場合は先に停止します。

### 正常系

```powershell
curl.exe -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"NestJSを学ぶ\",\"description\":\"POST API確認\"}"
```

### 異常系

```powershell
curl.exe -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"\"}"
curl.exe -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"確認\",\"unexpected\":true}"
```

## コードを読む順番

1. `src/main.ts`でGlobal ValidationPipeの2オプションを見る。
2. `src/app.module.ts`からTasksModuleへ進む。
3. `tasks.module.ts`でControllerとServiceの登録を見る。
4. `create-task.dto.ts`で各デコレーターを見る。
5. ControllerからServiceへDTOが渡る流れを見る。

## 観察ポイント

- 正常時が201になり、IDとcreatedAtが生成されるか
- description省略時に空文字になるか
- title未指定、空文字、81文字以上が400になるか
- descriptionの型不正や201文字以上が400になるか
- DTO未定義フィールドが400で拒否されるか
- 同じ入力を2回送っても保存されず、別ID風のレスポンスだけ返るか

## 壊して直す演習

1. titleの`@IsNotEmpty()`を一時的に外し、空文字の結果を見る。
2. `forbidNonWhitelisted`をfalseへ変え、余分なフィールドの扱いを比較する。
3. Controllerの`@Post()`を`@Post("create")`へ変え、URLとの対応を見る。
4. Serviceから`description ?? ""`を外し、省略値のレスポンスを比較する。

## 自分の言葉で説明する

- TypeScript型とclass-validatorの役割の違いは何ですか。
- whitelistとforbidNonWhitelistedを両方使う理由は何ですか。
- このAPIを「タスク保存API」と呼べない理由は何ですか。

## うまく動かないとき

- JSON構文エラーの場合は、引用符とContent-Typeを確認します。
- 404の場合は、HTTPメソッドと`/tasks`を確認します。
- 検証されない場合は、Global ValidationPipeとDTOデコレーターを確認します。

## 学習完了の目安

- [ ] 正常系201と3種類以上の400を確認した
- [ ] DTOからServiceまでの流れを説明できた
- [ ] 未定義フィールド拒否を壊して直した
- [ ] `npm run build`が成功した
