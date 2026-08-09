# web15 APIエラーパターン

NestJS標準の例外クラスを使い、200、400、404、500のレスポンスを比較するテーマです。

## このテーマでできるようになること

- HTTPステータスを成功・入力不備・未発見・サーバー障害に対応付けられる
- NestJSの標準例外から生成されるレスポンスを確認できる
- statusとresponse bodyを分けて調査できる
- 想定内の業務エラーと予期しない障害の違いを説明できる

## 関連資料

1. [要件定義](../../requirements/web15_api_error_patterns_requirements.md)
2. [基本設計](../../basic_design/web15_basic_design.md)
3. [詳細設計](../../detailed_design/web15_detailed_design.md)
4. [Controller実装](../../../src/backend/src/studyweb/systems/web15_api_error_patterns/src/errors/errors.controller.ts)
5. [Service実装](../../../src/backend/src/studyweb/systems/web15_api_error_patterns/src/errors/errors.service.ts)

## 資料を見る前の確認問題

- 400と404は、利用者が何を変えると解決できるエラーでしょうか。
- 500へ内部例外の詳細をそのまま含めると何が危険ですか。
- `fetch`はHTTP 500を受け取ると必ず例外を投げるでしょうか。

## 15分で再開する

1. APIを起動する。
2. 4つのURLを`curl.exe -i`で呼ぶ。
3. status、message、errorの違いを表へ書く。
4. Controllerの各例外クラスと結果を対応付ける。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run start:dev
```

3000番をweb13・14等が使っている場合は先に停止します。`npm run build`でビルドを確認できます。

## 確認コマンド

```powershell
curl.exe -i http://localhost:3000/status/ok
curl.exe -i http://localhost:3000/status/bad-request
curl.exe -i http://localhost:3000/status/not-found
curl.exe -i http://localhost:3000/status/server-error
```

## コードを読む順番

1. `src/main.ts`で起動とポートを見る。
2. `errors.module.ts`でControllerとServiceの登録を見る。
3. `errors.controller.ts`で4ルートと例外クラスを見る。
4. `errors.service.ts`で正常レスポンスだけを生成する理由を考える。

## 比較表

| パス | status | 実装 |
|---|---:|---|
| `/status/ok` | 200 | Serviceのobjectを返す |
| `/status/bad-request` | 400 | `BadRequestException` |
| `/status/not-found` | 404 | `NotFoundException` |
| `/status/server-error` | 500 | `InternalServerErrorException` |

## 壊して直す演習

1. bad-requestで`NotFoundException`を投げ、クラスとstatusの対応を見る。
2. `/status/unknown`を呼び、Controllerで明示した404とのbody差を比較する。
3. 例外messageを一時的に変更し、statusは変わらないことを確認する。
4. APIを停止して同じcurlを実行し、HTTPエラーと接続エラーの違いを見る。

## 自分の言葉で説明する

- 400、404、500をそれぞれ1つの利用場面で説明してください。
- 明示的な`NotFoundException`と未定義ルートの404は何が違いますか。
- statusだけでなくbodyも確認する理由は何ですか。

## うまく動かないとき

- 接続できない場合は、APIプロセスと3000番ポートを確認します。
- すべて404の場合は、`/status`を含む完全なパスを確認します。
- bodyが見えない場合は、curlへ`-i`を付けてheaderとbodyを確認します。

## 学習完了の目安

- [ ] 200、400、404、500を確認した
- [ ] 例外クラスとstatusの対応を説明できた
- [ ] HTTPエラーと接続エラーを区別できた
- [ ] `npm run build`が成功した
