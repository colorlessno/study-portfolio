# security02 JWT認証

HMAC署名付きJWTの発行、headerとclaimの確認、署名不一致、期限切れをNode標準機能だけで比較する教材です。HTTP確認は15分、Session方式との違いと運用上の制約を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- JWTのheader、payload、signatureを分けて説明できる
- payloadは読めるが、署名により改ざんを検出できることを確認できる
- Bearer tokenの正常、署名不一致、期限切れを比較できる
- Session認証とJWT認証で、サーバーが保持する状態の違いを説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [JWT認証 要件定義](../../requirements/security02_jwt_auth_requirements.md) |
| 基本設計 | [JWT認証 基本設計](../../basic_design/security02_basic_design.md) |
| 詳細設計 | [JWT認証 詳細設計](../../detailed_design/security02_detailed_design.md) |
| 補足 | [JWT claim](./jwt_claims.md) |
| 実装 | [security02 ソース](../../../src/backend/src/studysecurity/systems/security02_jwt_auth/) |

## 資料を見る前の確認問題

1. Base64URLでdecodeできるpayloadへ秘密情報を入れてはいけないのはなぜですか。
2. signatureが正しければ、tokenをいつまでも受け入れてよいでしょうか。
3. Session IDとJWTが漏洩した場合、それぞれ何を無効化する必要がありますか。

## 現実装の範囲

| API | 実装していること | 実装していないこと |
|---|---|---|
| `POST /token` | 固定した`sub`と`role`、10分後の`exp`を持つJWTを発行 | user IDとpasswordの検証 |
| `POST /token/expired` | 期限切れJWTを即時再現 | 任意の期限指定 |
| `GET /profile` | HS256 header、HMAC署名、`exp`を検証 | issuer、audience、refresh token、失効list |

## 15分で再開する

リポジトリのルートから構文確認とサーバー起動を行います。

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security02_jwt_auth run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security02_jwt_auth run start
```

別のターミナルでtokenを発行し、正常、改ざん、期限切れを比較します。

```powershell
$token = (Invoke-RestMethod -Method Post -Uri http://localhost:4102/token).token
curl.exe -i -H "Authorization: Bearer $token" http://localhost:4102/profile

$replacement = if ($token.EndsWith('x')) { 'y' } else { 'x' }
$tampered = $token.Substring(0, $token.Length - 1) + $replacement
curl.exe -i -H "Authorization: Bearer $tampered" http://localhost:4102/profile

$expired = (Invoke-RestMethod -Method Post -Uri http://localhost:4102/token/expired).token
curl.exe -i -H "Authorization: Bearer $expired" http://localhost:4102/profile
```

期待結果は正常tokenが200、改ざんtokenが401 `signature`、期限切れtokenが401 `expired`です。確認後は`Ctrl+C`でサーバーを停止します。

payloadは次のようにローカルで読めます。読めることと、改ざん後も署名が正しいことは別です。

```powershell
$env:STUDY_JWT = $token
node -e "console.log(JSON.parse(Buffer.from(process.env.STUDY_JWT.split('.')[1], 'base64url').toString('utf8')))"
Remove-Item Env:STUDY_JWT
```

## コードを読む順番

1. [`package.json`](../../../src/backend/src/studysecurity/systems/security02_jwt_auth/package.json): 外部JWTライブラリを使わない教材であることを確認する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security02_jwt_auth/app/server.js)の`issueToken`: claimと署名対象を追う
3. `verify`: token分割、署名、header、`exp`の順に検証する理由を考える
4. `/profile`: Bearer tokenの取出しと401応答を確認する

## 観察ポイント

- JWTは暗号化された秘密箱ではなく、署名付きデータとして扱う
- signatureの比較前に長さを確認し、形式不正でもサーバーを停止させない
- `exp`はpayloadにあるだけでは不十分で、受信側が現在時刻と比較する
- `JWT_SECRET`未指定時の固定鍵はローカル教材専用である
- 詳細な401理由を外部へ返すかは、本番の脅威モデルと運用方針で判断する

## 安全な改造課題

1. `/token`の有効期間を60秒へ変え、`exp - iat`が変わることを確認する。
2. `issuer`と`audience`を追加し、発行側と検証側の両方で確認する。
3. `JWT_SECRET`を環境変数で指定し、異なる鍵で発行・検証した場合の結果を予想する。
4. エラー理由を外部では`invalid_token`へ統一し、内部ログとの役割分担を考える。

## 自分の言葉で説明する

- payloadを読めることと、signatureを偽造できないことの違い
- Session認証とJWT認証で、logoutや強制失効の設計が異なる理由
- 署名、期限、issuer、audienceを別々に検証する理由

## 学習用実装の制約

- 資格情報を検証せず、固定claimのtokenを発行する
- access tokenだけを扱い、refresh、鍵ローテーション、失効管理を扱わない
- 未指定時の署名鍵はソース内の学習用ダミー値である
- 認証済みtokenをCookieやブラウザーへ保存するUIはない

## 学習完了の目安

- レベル1（再現）: 正常、署名不一致、期限切れの3応答を確認できる
- レベル2（説明）: JWTの3要素、署名、期限、Session方式との差を説明できる
- レベル3（改造）: claimまたは検証条件を追加し、成功と失敗を再現できる

次は[security03 RBAC](../security03_rbac/README.md)へ進み、認証後のroleを操作権限へ変換します。
