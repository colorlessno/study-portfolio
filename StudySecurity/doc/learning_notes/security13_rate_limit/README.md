# security13 レート制限

10秒の固定時間窓で3回まで許可するin-memory limiterを使い、key、閾値、429、reset境界を学ぶlocal教材です。CLI再現は15分、本番のdistributed設計を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- fixed window counterの状態遷移を説明できる
- user ID相当値とIP相当値のkey設計を比較できる
- 429、`Retry-After`、残り回数をHTTP応答へ表現できる
- 認証・認可・bot対策とrate limitを区別できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [レート制限 要件定義](../../requirements/security13_rate_limit_requirements.md) |
| 基本設計 | [レート制限 基本設計](../../basic_design/security13_basic_design.md) |
| 詳細設計 | [レート制限 詳細設計](../../detailed_design/security13_detailed_design.md) |
| 補足 | [Limit policy](./limit_policy.md) |
| 実装 | [security13 ソース](../../../src/backend/src/studysecurity/systems/security13_rate_limit/) |

## 資料を見る前の確認問題

1. IPだけをkeyにすると、会社や家庭の共有回線で何が起きますか。
2. clientが自由に送れるheaderをuser IDとして信用すると、どう回避されますか。
3. applicationを2instanceへ増やしたとき、memory counterはどうなりますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security13_rate_limit run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security13_rate_limit run demo
```

demoは同じkeyへ時刻0、1、2、3msでrequestした結果を`true, true, true, false`、10秒の境界で`true`として検証します。

HTTPで観察する場合は別terminalでserverを起動し、local endpointだけへ4回送ります。

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security13_rate_limit run start
1..4 | ForEach-Object { curl.exe -s -i -H "X-Demo-User: learner" http://localhost:4113/ }
```

確認後は`Ctrl+C`で停止します。

## コードを読む順番

1. [`limit_policy.md`](./limit_policy.md): keyと429の方針を確認する
2. [`rate_limiter.js`](../../../src/backend/src/studysecurity/systems/security13_rate_limit/app/rate_limiter.js): counterとreset境界を追う
3. [`demo.js`](../../../src/backend/src/studysecurity/systems/security13_rate_limit/app/demo.js): 時刻を固定した再現を見る
4. [`server.js`](../../../src/backend/src/studysecurity/systems/security13_rate_limit/app/server.js): HTTP keyとheaderへの変換を見る

## 観察ポイント

- `now >= resetAt`で境界時刻から新しい窓にする
- `X-Demo-User`は学習用入力で、本人確認済みidentityではない
- `/health`は制限対象外だが、productionの除外endpointは最小限にする
- `Retry-After`は再試行可能な目安であり、必ず受信側が待つ保証はない
- Mapは期限切れkeyを自動削除しない

## 安全な改造課題

1. 異なる2つのkeyでcounterが分離されるtestを追加する。
2. login、search、expensive reportで別の閾値を設計する。
3. token bucketとfixed windowのburst特性を比較する。
4. trusted proxyからclient IPを受け取る条件を定義する。

## 自分の言葉で説明する

- key、limit、windowの選択による誤制限と回避
- 429とservice capacity protectionの関係
- distributed storeでatomic updateと期限管理が必要な理由

## 学習用実装の制約

- local memoryだけを使い、複数instanceへ共有しない
- `X-Demo-User`を認証へ使わない
- 外部serviceや本番trafficへ連続requestを送らない

## 学習完了の目安

- レベル1（再現）: 3回成功、4回目拒否、reset後成功を確認できる
- レベル2（説明）: key・窓・429の関係を説明できる
- レベル3（改造）: endpoint別・distributed limiterを設計できる
