# security03 RBAC

サーバー側の固定ユーザーからroleを取得し、操作ごとの権限表で注文閲覧と取消を判定するRBAC教材です。HTTP確認は15分、401と403、roleとpermission、UI制御とAPI認可の違いを説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- 認証は「誰か」、認可は「何をしてよいか」と説明できる
- roleとpermissionを分離し、操作単位で許可を判定できる
- 未認証の401と、認証済みだが権限不足の403を比較できる
- 画面上でボタンを隠すだけではAPIを保護できない理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [RBAC認可 要件定義](../../requirements/security03_rbac_authorization_requirements.md) |
| 基本設計 | [RBAC認可 基本設計](../../basic_design/security03_basic_design.md) |
| 詳細設計 | [RBAC 詳細設計](../../detailed_design/security03_detailed_design.md) |
| 補足 | [ロール権限表](./role_matrix.md) |
| 実装 | [security03 ソース](../../../src/backend/src/studysecurity/systems/security03_rbac/) |

## 資料を見る前の確認問題

1. ログインに成功したユーザーなら、すべてのAPIを呼べるでしょうか。
2. roleをAPIごとの`if`へ直接書き続けると、どのような問題が起きますか。
3. 401と403をどの時点で使い分けますか。

## 現実装の範囲

- `X-User`には`a-admin`、`o-operator`、`v-viewer`のいずれかを指定する
- サーバー内の固定ユーザーからroleを取得し、`permissions`表で判定する
- 注文閲覧は3 role、注文取消はadminとoperatorだけを許可する
- 本物のlogin、Session/JWTとの接続、UIの表示制御、永続ユーザーDBは実装しない

`X-User`は本人確認済み情報ではありません。任意の利用者がheaderを書けるため、本番ではsecurity01またはsecurity02のような認証結果からuser IDを確立し、サーバー側でroleを取得します。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security03_rbac run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security03_rbac test
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security03_rbac run start
```

自動テストはephemeral portで401、403、200と未知routeを確認します。続いて手動確認する場合は、別のターミナルで未認証、viewer、operatorを比較します。

```powershell
curl.exe -i http://localhost:4103/orders
curl.exe -i -H "X-User: v-viewer" http://localhost:4103/orders
curl.exe -i -X POST -H "X-User: v-viewer" http://localhost:4103/orders/o-100/cancel
curl.exe -i -X POST -H "X-User: o-operator" http://localhost:4103/orders/o-100/cancel
```

期待するHTTP statusは`401 → 200 → 403 → 200`です。確認後は`Ctrl+C`でサーバーを停止します。

## コードを読む順番

1. [`role_matrix.md`](./role_matrix.md): user、role、permissionの対応を予想する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security03_rbac/app/server.js)の`users`: header値を固定ユーザーへ変換する箇所を確認する
3. `permissions`: roleと操作の対応を確認する
4. `authorize`: 許可表を参照する共通判定を追う
5. 2つのAPI: 401、403、200を返す条件を比較する

## 観察ポイント

- user ID、role、permissionは同じ概念ではない
- viewerも認証済みユーザーだが、取消permissionがないため403になる
- API handlerの前でuserを確立し、操作直前にpermissionを判定する
- responseへuserとroleを含めるのは観察用であり、本番の返却項目は必要最小限にする
- UI非表示の比較画面は未実装なので、APIを直接呼べるcurlで認可の必要性を確認する

## 安全な改造課題

1. `orders:export`を追加し、adminだけに許可する。
2. `auditor` roleを追加し、閲覧は許可、取消は拒否する。
3. handler内へrole名を直書きした場合と、permission表を使う場合の変更箇所を比較する。
4. エラー応答から内部のroleや許可表が漏れないことを確認する。

## 自分の言葉で説明する

- 認証、role取得、permission判定の順番
- viewerの取消が401ではなく403になる理由
- フロントエンドのボタン非表示とAPI側認可の役割の違い

## 学習用実装の制約

- `X-User`を送れる人が任意の固定ユーザーを選べるため、認証機能ではない
- user、role、注文はメモリ上の固定データで、変更を保存しない
- roleの階層、複数role、組織境界、監査ログは扱わない
- 自動テストは固定user・注文だけを使い、本物の認証基盤や永続化は検証しない

## 学習完了の目安

- レベル1（再現）: 401、viewerの403、operatorの200を確認できる
- レベル2（説明）: user、role、permission、401、403を区別できる
- レベル3（改造）: roleまたはpermissionを追加し、許可・拒否を再現できる

次は[security04 ABAC](../security04_abac/README.md)へ進み、role以外の部署や注文状態を認可条件へ加えます。
