# security01 Session認証

ローカルメモリのSessionと `HttpOnly` Cookieを使い、ログイン、本人確認、ログアウトを確認する依存パッケージなしのNode.js教材です。学習時間の目安は、HTTPの確認だけなら15分、Cookieとサーバー側状態の関係を説明するまでなら45〜90分です。

## このテーマでできるようになること

- 認証と認可、CookieとSessionの違いを説明できる
- 未ログイン、ログイン済み、ログアウト後のHTTP応答を比較できる
- `HttpOnly`、`SameSite`、`Path` の役割を確認できる
- 学習用実装と本番用認証に必要な対策の差を説明できる

## 認証・認可グループでの位置付け

security01は「誰であるか」をCookieとサーバー側Sessionで確立する入口です。次のsecurity02では認証状態を署名付きtokenへ移し、security03とsecurity04では認証後に「何をしてよいか」を判定します。

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [Session認証 要件定義](../../requirements/security01_session_auth_requirements.md) |
| 基本設計 | [Session認証 基本設計](../../basic_design/security01_basic_design.md) |
| 詳細設計 | [Session認証 詳細設計](../../detailed_design/security01_detailed_design.md) |
| 補足 | [認証フロー](./auth_flow.md) / [Cookie確認](./cookie_check.md) |
| 実装 | [security01 ソース](../../../src/backend/src/studysecurity/systems/security01_session_auth/) |

## 資料を見る前の確認問題

1. Cookieにユーザー情報そのものではなくSession IDを入れる理由は何ですか。
2. `401 Unauthorized` はどの状態を表しますか。
3. `HttpOnly` を付けても防げない攻撃やリスクは何ですか。

## 15分で再開する

リポジトリのルートから構文確認とサーバー起動を行います。

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security01_session_auth run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security01_session_auth run start
```

別のターミナルで、認証状態の変化を確認します。

```powershell
curl.exe -i http://localhost:4101/me
curl.exe -i -c security01.cookies -H "Content-Type: application/json" -d '{"userId":"u-demo","password":"passw0rd"}' http://localhost:4101/login
curl.exe -i -b security01.cookies http://localhost:4101/me
curl.exe -i -b security01.cookies -X POST http://localhost:4101/logout
curl.exe -i -b security01.cookies http://localhost:4101/me
Remove-Item -LiteralPath .\security01.cookies
```

期待する状態遷移は `401 → 200 → 200 → 200 → 401` です。確認後は `Ctrl+C` でサーバーを停止します。

## コードを読む順番

1. [`package.json`](../../../src/backend/src/studysecurity/systems/security01_session_auth/package.json): 外部依存がないことと実行コマンドを確認する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security01_session_auth/app/server.js) の `POST /login`: 認証とSession作成を追う
3. `GET /me`: CookieからSession IDを取り、サーバー側のMapと照合する処理を追う
4. `POST /logout`: Session削除とCookie無効化を確認する

## 観察ポイント

- 未ログインの `GET /me` は401を返す
- `POST /login` はランダムな `sid` を作り、`Set-Cookie` を返す
- JSONとして解釈できないlogin bodyは400 `invalid_json`を返し、サーバーは継続する
- Cookieにはユーザー名やパスワードではなくSession IDだけが入る
- Session本体はサーバー側の `Map` に保存される
- ログアウト後は同じCookieを送っても401になる

## 壊して直す演習

1. Cookieを送らずに `GET /me` を実行し、サーバー側状態だけでは認証されないことを確認する。
2. Cookieファイル内の `sid` を変更し、401になる理由を説明する。
3. サーバーを再起動し、メモリ上のSessionが消えることを確認する。
4. `SameSite=Lax` や `HttpOnly` を一時的に外し、レスポンスヘッダーの差を確認して元に戻す。

## 自分の言葉で説明する

- ログインから認証済みAPI呼び出しまでのデータの流れ
- Cookieとサーバー側Sessionのどちらか一方だけでは成立しない理由
- 本番ではパスワードハッシュ、永続Session Store、HTTPS、期限管理などが必要な理由

## 学習用実装の制約

- 固定ユーザーと平文の学習用パスワードを使う
- Sessionをプロセス内メモリに保存するため、再起動で消える
- HTTPS、CSRF token、期限切れ、Session IDのローテーション等は扱わない
- 実ユーザー、実パスワード、実秘密情報は扱わない

## 学習完了の目安

- レベル1（再現）: ログイン前後とログアウト後の応答を確認できる
- レベル2（説明）: Cookie、Session、401、Cookie属性を説明できる
- レベル3（改造）: Session期限または保護属性を追加し、テスト観点を説明できる

次は [security02 JWT認証](../security02_jwt_auth/README.md) と比較し、サーバー側Sessionを持つ方式との違いを整理します。
