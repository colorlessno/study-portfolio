# web13 NestJS Hello API

NestJSのModule、Controller、Serviceの責務分担を、`GET /hello`からJSONを返す最小APIで学ぶテーマです。

## このテーマでできるようになること

- NestJSアプリの起動処理を追える
- ModuleへのControllerとProviderの登録を説明できる
- ControllerからServiceへ処理を委譲できる
- HTTPステータスとJSONレスポンスを確認できる

## 関連資料

1. [要件定義](../../requirements/web13_nest_hello_api_requirements.md)
2. [基本設計](../../basic_design/web13_basic_design.md)
3. [詳細設計](../../detailed_design/web13_detailed_design.md)
4. [Controller実装](../../../src/backend/src/studyweb/systems/web13_nest_hello_api/src/app.controller.ts)
5. [Service実装](../../../src/backend/src/studyweb/systems/web13_nest_hello_api/src/app.service.ts)

## 資料を見る前の確認問題

- HTTPリクエストの受付とレスポンス生成を分ける利点は何ですか。
- NestJSのProviderは、どこへ登録するとDIで利用できますか。
- ISO 8601の日時文字列を見分けられますか。

## 15分で再開する

1. APIを起動する。
2. `/hello`を呼び、statusと3フィールドを確認する。
3. `/unknown`を呼び、404を確認する。
4. ControllerからServiceまでをコード上で1往復する。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run start:dev
```

別のターミナルから確認します。

```powershell
curl.exe -i http://localhost:3000/hello
curl.exe -i http://localhost:3000/unknown
```

`npm run build`でNestJSのビルドも確認できます。

## コードを読む順番

1. `src/main.ts`でAppModuleと3000番ポートを見る。
2. `src/app.module.ts`でControllerとProviderの登録を見る。
3. `src/app.controller.ts`で`@Get("hello")`とconstructor injectionを見る。
4. `src/app.service.ts`で固定値とtimestampの生成を見る。

## 処理の流れ

```text
GET /hello
  ↓
AppController.getHello()
  ↓ DIされたService
AppService.getHello()
  ↓
objectをNestJSがJSONへ変換
  ↓
HTTP 200
```

## 観察ポイント

- `message`と`sample`が固定値か
- `timestamp`がISO形式で、呼出しごとに生成されるか
- Content-TypeがJSONか
- 未定義パスがNestJS標準の404になるか
- Controllerがレスポンス内容を直接組み立てていないか

## 壊して直す演習

1. `@Get("hello")`を一時的に`@Get("greeting")`へ変え、URLとの対応を見る。
2. AppModuleの`providers`からAppServiceを外し、起動時のDIエラーを観察する。
3. Serviceの`new Date().toISOString()`を固定値へ変え、動的値の役割を見る。
4. 3000番ポートを別プロセスで使用し、起動失敗メッセージを確認する。

## 自分の言葉で説明する

- Module、Controller、Serviceをそれぞれ1文で説明してください。
- Controllerが`new AppService()`しない理由は何ですか。
- 未定義パスの404は、どのコードが明示的に返していますか。

## うまく動かないとき

- 起動しない場合は、依存関係、TypeScriptエラー、3000番ポートを確認します。
- 404の場合は、HTTPメソッド、Controllerのパス、呼出しURLを照合します。
- 500またはDIエラーの場合は、Moduleのcontrollers/providers登録を確認します。

## 学習完了の目安

- [ ] 200と404を確認した
- [ ] ControllerからServiceへの流れを説明できた
- [ ] DI登録の故障を観察して直した
- [ ] `npm run build`が成功した
