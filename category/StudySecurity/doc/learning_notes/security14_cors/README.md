# security14 CORS設計

Origin allowlistとpreflight応答を確認し、CORSがbrowserのresponse公開制御であって認証・認可ではないことを学ぶlocal教材です。header確認は15分、CSRF等との境界を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- Originを完全一致のallowlistで判定できる
- simple requestとpreflight requestの差を説明できる
- credentials利用時にwildcard Originを避ける理由を説明できる
- CORS、CSRF、認証、認可の責務を区別できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [CORS 要件定義](../../requirements/security14_cors_requirements.md) |
| 基本設計 | [CORS 基本設計](../../basic_design/security14_basic_design.md) |
| 詳細設計 | [CORS 詳細設計](../../detailed_design/security14_detailed_design.md) |
| 補足 | [CORS matrix](./cors_matrix.md) |
| 実装 | [security14 ソース](../../../src/backend/src/studysecurity/systems/security14_cors/) |

## 資料を見る前の確認問題

1. CORSで許可しなければ、curlや別serverからAPIへ到達できなくなりますか。
2. `Access-Control-Allow-Origin: *`とcredentialsを安全に併用できますか。
3. Originによってresponse headerが変わる場合、cacheへ何を伝える必要がありますか。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security14_cors run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security14_cors run start
```

別terminalで許可Originと不許可Originのpreflightを比較します。

```powershell
curl.exe -i -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" http://localhost:4114/
curl.exe -i -X OPTIONS -H "Origin: https://not-allowed.example" -H "Access-Control-Request-Method: POST" http://localhost:4114/
```

許可Originは204とCORS header、不許可Originは403で許可headerなしになります。どちらにも`Vary`が返ることを確認し、serverは`Ctrl+C`で停止します。

## コードを読む順番

1. [`cors_matrix.md`](./cors_matrix.md): 許可Originを確認する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security14_cors/app/server.js): allowlist、preflight、通常requestの分岐を追う
3. [security07 CSRF](../security07_csrf/README.md): Cookie付き状態変更との違いを比較する

## 観察ポイント

- Originはscheme、host、portの組であり、pathを含まない
- 不許可の通常requestにもserverは200を返し得るが、browserはJavaScriptへresponseを公開しない
- `Vary`は不許可Originのresponseにも必要
- credentialsを許可してもauthentication・authorizationは別途必要
- preflight成功は業務request成功を保証しない

## 安全な改造課題

1. 許可method・request headerもpreflightで検証する。
2. developmentとproductionでOrigin設定を分離する。
3. suffix一致がsubdomain takeoverや偽domainを許す例を整理する。
4. CORS、SameSite Cookie、CSRF tokenの役割を表にする。

## 自分の言葉で説明する

- CORSを強制する主体がbrowserであること
- preflightが必要になる条件
- CORSをAPI access制御の代替にできない理由

## 学習用実装の制約

- local Origin 2件だけを固定で許可する
- user認証、権限判定、CSRF防御を実装しない
- browser automationや外部siteからのrequestを行わない

## 学習完了の目安

- レベル1（再現）: 許可204と不許可403を確認できる
- レベル2（説明）: credentials、preflight、`Vary`を説明できる
- レベル3（改造）: environment別の狭いCORS policyを設計できる
