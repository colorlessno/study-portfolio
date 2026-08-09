# security11 Webhook署名検証

raw body、timestamp、HMAC署名、event IDを検証し、改ざん検知とreplay防止を分けて学ぶlocal教材です。CLI demoは15分、HTTP境界と永続化を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- `timestamp.rawBody`のHMAC-SHA256を生成・検証できる
- parse前のbody bytesが必要な理由を説明できる
- timestampの期限とevent IDの重複検出を使い分けられる
- signature比較にtiming-safeな処理を使う理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [Webhook署名 要件定義](../../requirements/security11_webhook_signature_requirements.md) |
| 基本設計 | [Webhook署名 基本設計](../../basic_design/security11_basic_design.md) |
| 詳細設計 | [Webhook署名 詳細設計](../../detailed_design/security11_detailed_design.md) |
| 補足 | [Replay protection](./replay_protection.md) |
| 実装 | [security11 ソース](../../../src/backend/src/studysecurity/systems/security11_webhook_signature/) |

## 資料を見る前の確認問題

1. 同じ意味のJSONをparseして再serializeしたbodyは、元と同じ署名になりますか。
2. 正しい署名付きrequestを第三者がそのまま再送した場合、署名検証だけで拒否できますか。
3. event IDをmemoryだけへ保存すると、再起動時に何が起きますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security11_webhook_signature run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security11_webhook_signature test
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security11_webhook_signature run demo
```

自動テストは署名対象の変更、5分ちょうどと1ms超過、event ID不足、署名不一致、replayを固定時刻で確認します。

| case | 期待status | 観察する判断 |
|---|---:|---|
| valid | 200 | 全検証を通過する |
| replay | 409 | 同じevent IDを再実行しない |
| tampered | 401 | body変更で署名が一致しない |
| expired | 401 | 5分の許容範囲外を拒否する |
| missing event id | 400 | replay管理に必要なID不足を拒否する |

HTTP serverを確認する場合は`npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security11_webhook_signature run start`で`http://localhost:4111/webhook`を起動し、確認後に`Ctrl+C`で停止します。最初は署名生成が内包されたCLI demoから始めます。

## コードを読む順番

1. [`signature.js`](../../../src/backend/src/studysecurity/systems/security11_webhook_signature/app/signature.js): HMAC対象とtiming-safe比較を見る
2. [`webhook.js`](../../../src/backend/src/studysecurity/systems/security11_webhook_signature/app/webhook.js): timestamp、ID、署名、replayの順を追う
3. [`demo.js`](../../../src/backend/src/studysecurity/systems/security11_webhook_signature/app/demo.js): 5つのcaseと期待statusを確認する
4. [`server.js`](../../../src/backend/src/studysecurity/systems/security11_webhook_signature/app/server.js): raw bodyと64KiB上限を確認する

## 観察ポイント

- signatureはtimestamp、`.`、body bytesの順に更新する
- 不正timestampを`NaN`のまま比較しない
- 未署名のevent IDを処理済みstoreへ追加しない
- default secretはlocal教材用で、`WEBHOOK_SECRET`環境変数へ置き換えられる
- 64KiB上限はDoS対策の一部で、provider仕様と合わせる必要がある

## 安全な改造課題

1. 許容時間を境界値のちょうど5分でtestする。
2. secret rotation中に新旧2つのsignatureを検証する順序を設計する。
3. event IDの保存期間、unique制約、処理とのtransaction境界を決める。
4. providerごとにheader名と署名形式をadapterへ分離する。

## 自分の言葉で説明する

- HMACが送信者との共有secretを使う改ざん検知であること
- timestampだけ、event IDだけでは不十分な理由
- 「検証済み」と「業務処理済み」を同じtransactionで扱う必要性

## 学習用実装の制約

- 外部Webhook providerへ接続しない
- event IDはmemoryだけに保存し、再起動・複数instanceへ対応しない
- default secretは明確なdummyでproduction利用不可
- 自動テストはpure functionの境界を扱い、providerからの実HTTP deliveryは検証しない

## 学習完了の目安

- レベル1（再現）: 200、400、401、409をCLIで確認できる
- レベル2（説明）: raw body、期限、重複IDの役割を説明できる
- レベル3（改造）: 永続storeと業務処理を含むreplay防止を設計できる
