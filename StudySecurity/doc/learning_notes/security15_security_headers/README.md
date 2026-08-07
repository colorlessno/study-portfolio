# security15 セキュリティヘッダー

CSP、frame制御、nosniff、Referrer-Policy、Permissions-Policyを返すlocal HTTP serverで、browserへ防御policyを伝える方法を学びます。header確認は15分、production policyの導入手順を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- 主要security headerをresponseで確認できる
- CSPが許可するresourceを狭める仕組みを説明できる
- clickjacking、MIME sniffing、referrer、browser機能の各制御を区別できる
- HSTSをlocal HTTP教材へ付けない理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [Security headers 要件定義](../../requirements/security15_security_headers_requirements.md) |
| 基本設計 | [Security headers 基本設計](../../basic_design/security15_basic_design.md) |
| 詳細設計 | [Security headers 詳細設計](../../detailed_design/security15_detailed_design.md) |
| 補足 | [Header policy](./header_policy.md) |
| 実装 | [security15 ソース](../../../src/backend/src/studysecurity/systems/security15_security_headers/) |

## 資料を見る前の確認問題

1. CSPを設定すれば、出力encodingをしなくてもXSSを全て防げますか。
2. `frame-ancestors`と`X-Frame-Options`は何を防ぎますか。
3. HSTSをHTTPのlocalhost教材で確認しにくいのはなぜですか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security15_security_headers run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security15_security_headers run start
```

browserで`http://localhost:4115`を開いてDevToolsのNetworkからresponse headersを見るか、別terminalで確認します。

```powershell
curl.exe -i http://localhost:4115/
```

確認後は`Ctrl+C`で停止します。

## 現実装で確認するheader

| Header | 観察するpolicy |
|---|---|
| Content-Security-Policy | self限定、frameとobject拒否 |
| X-Frame-Options | framing拒否 |
| X-Content-Type-Options | MIME sniffing抑止 |
| Referrer-Policy | cross-originへのreferrer抑制 |
| Permissions-Policy | camera等の不要機能を無効化 |
| Cache-Control | 教材responseを保存しない |

## コードを読む順番

1. [`header_policy.md`](./header_policy.md): 各headerの目的を確認する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security15_security_headers/app/server.js): 実際の値とHTML responseを比較する
3. [security08 XSS](../security08_xss/README.md): CSPが補助する出力防御を比較する

## 観察ポイント

- `frame-ancestors 'none'`はCSP、`X-Frame-Options: DENY`はlegacy互換の層
- `default-src 'self'`だけではinline script導入時の影響確認が必要
- CSPはReport-Onlyで違反を観察してから段階導入できる
- HSTSはHTTPS responseで運用し、長い有効期間やsubdomain指定を簡単に戻せない
- headerはserver-side validation・encoding・認可の代替にならない

## 安全な改造課題

1. `Content-Security-Policy-Report-Only`から導入する手順を書く。
2. nonce型CSPとhash型CSPのbuild・cache上の違いを比較する。
3. 必要なbrowser機能だけをPermissions-Policyで許可する。
4. automated testで必須headerの欠落を検出する。

## 自分の言葉で説明する

- 各headerが対象にするbrowser動作
- CSPが防御層の一つであり完全防御ではない理由
- HSTSを有効化する前にHTTPS運用を確認すべき理由

## 学習用実装の制約

- local HTTP serverだけでproduction HTTPSを再現しない
- browser互換性や既存assetへの影響を網羅しない
- HSTSは説明対象だけでresponseへ付与しない

## 学習完了の目安

- レベル1（再現）: 6つのresponse headerを確認できる
- レベル2（説明）: CSP、frame、nosniff、HSTSの役割を説明できる
- レベル3（改造）: report-onlyから強制policyへ移行する手順を設計できる
