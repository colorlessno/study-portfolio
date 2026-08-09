# security04 ABAC

role、ユーザー部署、注文部署、注文状態を組み合わせて、参照と更新の許可を変えるABAC教材です。HTTP確認は15分、RBACとの境界と属性の信頼性を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- RBACとABACの判断材料を比較できる
- user属性とresource属性をpolicy関数で評価できる
- 部署一致と注文状態を別の認可条件として確認できる
- 認可に使う属性をrequest bodyから信用してはいけない理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [ABAC 要件定義](../../requirements/security04_abac_requirements.md) |
| 基本設計 | [ABAC 基本設計](../../basic_design/security04_basic_design.md) |
| 詳細設計 | [ABAC 詳細設計](../../detailed_design/security04_detailed_design.md) |
| 補足 | [ポリシー例](./policy_examples.md) |
| 実装 | [security04 ソース](../../../src/backend/src/studysecurity/systems/security04_abac/) |

## 資料を見る前の確認問題

1. roleだけでは表しにくい認可条件には何がありますか。
2. userの部署をrequest bodyから受け取ると、何が起きますか。
3. 管理者なら確定済み注文も更新可能にすべきでしょうか。どこで決めますか。

## 現実装の範囲

| 固定データ | 属性 | 意味 |
|---|---|---|
| `alice` | staff / sales | sales注文を参照し、draftなら更新できる |
| `bob` | staff / support | support注文を参照できる |
| `admin` | admin / hq | 部署に関係なく参照できるが、更新にはdraft条件も必要 |
| `o-200` | sales / draft | sales担当またはadminが参照、更新policyを満たせば更新できる |
| `o-201` | support / confirmed | support担当またはadminが参照できるが更新できない |

`X-User`は本物の認証ではなく、サーバー内の固定ユーザーを選ぶ教材用headerです。owner ID、tenant ID、DBのrow level security、policy engineは対象外です。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security04_abac run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security04_abac run start
```

別のターミナルで部署と状態の違いを確認します。

```powershell
curl.exe -i -H "X-User: alice" http://localhost:4104/orders/o-200
curl.exe -i -X PATCH -H "X-User: alice" http://localhost:4104/orders/o-200
curl.exe -i -H "X-User: bob" http://localhost:4104/orders/o-200
curl.exe -i -H "X-User: bob" http://localhost:4104/orders/o-201
curl.exe -i -X PATCH -H "X-User: bob" http://localhost:4104/orders/o-201
curl.exe -i -H "X-User: admin" http://localhost:4104/orders/o-201
```

期待するHTTP statusは`200 → 200 → 403 → 200 → 403 → 200`です。確認後は`Ctrl+C`でサーバーを停止します。

## コードを読む順番

1. [`policy_examples.md`](./policy_examples.md): 表から結果を予想する
2. [`server.js`](../../../src/backend/src/studysecurity/systems/security04_abac/app/server.js)の`users`と`orders`: 信頼する属性の置場を確認する
3. `canRead`: roleとdepartmentを使うpolicyを追う
4. `canUpdate`: 参照policyへstatus条件を加える流れを追う
5. request handler: 401、403、404、200を分ける箇所を確認する

## 観察ポイント

- ABACではroleも属性の一つとして扱える
- 同じユーザーでも、対象注文の部署や状態で結果が変わる
- `admin`の例外は参照policyだけにあり、更新時の`draft`条件は残る
- 属性値だけでなく、その値を誰が設定し、どこから取得したかが重要である
- 存在するが許可されない注文は403、存在しない注文は404とする学習用方針である

## 安全な改造課題

1. 注文金額を追加し、高額注文はadminだけ更新できるpolicyを作る。
2. `admin`は注文状態に関係なく更新可能に変更し、業務上の利点と危険を比較する。
3. policy結果に理由codeを内部だけで保持し、外部responseには漏らさない設計を考える。
4. owner IDやtenant IDを追加する場合、一覧と詳細のどこでscopeを適用するか設計する。

## 自分の言葉で説明する

- RBACとABACの違いと、組み合わせて使う場合の判断順序
- request bodyの属性を認可に使ってはいけない理由
- `bob`が`o-201`を読めても更新できない理由

## 学習用実装の制約

- `X-User`を送れる人が任意の固定ユーザーを選べるため、認証機能ではない
- userと注文はメモリ上の固定データで、更新結果を保存しない
- 時刻、場所、risk score等のenvironment属性は扱わない
- policy engine、監査ログ、DB scopeは扱わない

## 学習完了の目安

- レベル1（再現）: 部署一致、不一致、状態不一致の応答を確認できる
- レベル2（説明）: RBACとの違い、属性の信頼境界、policyの判断順を説明できる
- レベル3（改造）: 新しい属性条件を追加し、許可・拒否を再現できる

security01〜04を終えたら、Session/JWTでuserを確立し、RBAC/ABACで操作を許可する一連の流れを図にして説明します。
