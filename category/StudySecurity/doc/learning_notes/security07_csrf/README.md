# security07 CSRF対策

Cookieがbrowserから自動送信される前提で、状態変更requestへ一回限りのCSRF tokenを追加し、Cookie欠落、token欠落、正しい組合せ、token再利用を比較するローカル教材です。HTTP確認は15分、SameSiteとtokenの役割分担を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- CSRFがCookie認証で成立する条件を説明できる
- 認証CookieとCSRF tokenを別々に検証できる
- 401と403をCookie欠落・token不正へ使い分けられる
- SameSiteを補助対策として説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [CSRF 要件定義](../../requirements/security07_csrf_requirements.md) |
| 基本設計 | [CSRF 基本設計](../../basic_design/security07_basic_design.md) |
| 詳細設計 | [CSRF 詳細設計](../../detailed_design/security07_detailed_design.md) |
| 補足 | [CSRFフロー](./csrf_flow.md) |
| 実装 | [security07 ソース](../../../src/backend/src/studysecurity/systems/security07_csrf/) |

## 資料を見る前の確認問題

1. 攻撃元がCookieの値を読めなくても、CSRFが成立することがあるのはなぜですか。
2. SameSiteを設定すればCSRF tokenは必ず不要になるでしょうか。
3. GETで残高や注文状態を変更してはいけない理由は何ですか。

## 現実装の範囲

- `GET /form`で`sid=demo` Cookieと5分期限のtokenを発行する
- `POST /transfer`でCookieを確認し、tokenを一度だけ受け入れる
- 成功時はメモリ上のダミー残高を1減らす
- 本物のlogin、複数session、外部originの攻撃pageは実装しない

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security07_csrf run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security07_csrf run start
```

別のターミナルでformからCookieとtokenを取得します。

```powershell
$cookie = Join-Path $env:TEMP 'studysecurity-security07.cookies'
$form = curl.exe -s -c $cookie http://localhost:4107/form
$token = [regex]::Match($form, 'value="([a-f0-9]+)"').Groups[1].Value

curl.exe -i --data-urlencode "csrf=$token" http://localhost:4107/transfer
curl.exe -i -X POST -b $cookie http://localhost:4107/transfer
curl.exe -i -b $cookie --data-urlencode "csrf=$token" http://localhost:4107/transfer
curl.exe -i -b $cookie --data-urlencode "csrf=$token" http://localhost:4107/transfer

Remove-Item -LiteralPath $cookie
```

期待するstatusは、Cookieなし401、tokenなし403、正しい組合せ200、同じtokenの再利用403です。確認後は`Ctrl+C`でサーバーを停止します。

## コードを読む順番

1. [`csrf_flow.md`](./csrf_flow.md): Cookieとtokenの2経路を確認する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security07_csrf/app/server.js)の`GET /form`: Cookie、token、期限を追う
3. `parseCookies`: requestからSession識別子を取得する
4. `POST /transfer`: Cookieを先に確認し、tokenを一回限りで削除する順序を追う
5. 成功時だけダミー残高を変更することを確認する

## 観察ポイント

- Cookieはrequestへ自動付与されるが、form tokenは攻撃元が通常は取得できない前提を使う
- Cookie欠落は本人状態を確立できないため401、token不正は状態があってもrequestを信用できないため403とする
- tokenは利用時に削除され、同じ値を再送できない
- tokenは5分期限だが、未使用tokenの定期削除は行わないローカル実装である
- SameSite=Laxだけを完全防御と扱わない

## 安全な改造課題

1. token期限を10秒へ変え、期限前後の結果を比較する。
2. tokenをSessionごとに関連付け、別Sessionのtokenを拒否する設計へ変える。
3. JSON APIでheaderへtokenを入れる方式を設計する。
4. Origin / Referer検証を追加する場合の利点とproxy環境の注意を整理する。

## 自分の言葉で説明する

- Cookie認証でCSRFが成立する流れ
- SameSite、CSRF token、Origin検証の役割の違い
- XSSがあるとCSRF tokenだけでは守れない理由

## 学習用実装の制約

- `sid=demo`は固定値で、本物のSession storeではない
- tokenはprocess memoryだけに保存し、再起動で消える
- 外部origin、HTTPS、proxy、複数instanceは扱わない
- 状態変更はダミー残高だけで、実送金を行わない

## 学習完了の目安

- レベル1（再現）: 401、403、200、再利用403を確認できる
- レベル2（説明）: Cookie自動送信、token、SameSiteの役割を説明できる
- レベル3（改造）: tokenの期限またはSession関連付けを変更し、失敗を再現できる

次は[security08 XSS](../security08_xss/README.md)へ進み、browser内の出力contextを確認します。
