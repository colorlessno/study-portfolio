# web43 idempotency key

`POST /orders` に `Idempotency-Key` を付け、同じkeyの再送時に初回結果を再利用する Node.js API。同じ操作が通信再送されても二重登録を起こしにくくする考え方を学ぶ。

## このテーマで身につけること

- 初回requestと再送requestをkeyで関連付ける
- 初回201と再送200のresponseを比較する
- 画面のbutton無効化と、API側の冪等性を区別する
- keyの保存期間、payload一致確認、同時request対策を設計課題として説明する

## 10分で再開する

前提は Node.js 20 以上。依存パッケージはなく、`npm install` は不要。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web43_idempotency_key
npm.cmd test
npm.cmd start
```

自動テストはephemeral portでkey不足、初回、同一payload再送、異なるpayload、不正JSONを確認する。APIは `http://localhost:3043/orders`。終了は `Ctrl+C`、構文確認は `npm.cmd run build`。

## 最初に試す順番

### 1. keyなし

```powershell
curl.exe -i -X POST http://localhost:3043/orders -H "Content-Type: application/json" -d "{\"name\":\"Sample\"}"
```

400と`idempotency_key_required`を確認する。

### 2. 初回登録

```powershell
curl.exe -i -X POST http://localhost:3043/orders -H "Content-Type: application/json" -H "Idempotency-Key: order-001" -d "{\"name\":\"Sample\"}"
```

201、`replay=false`、`count=1`を確認する。

### 3. 同じkeyで再送

同じコマンドをもう一度実行し、200、`replay=true`、同じ`result.id`、`count=1`を確認する。短い確認観点は [Duplicate Check](docs/duplicate_check.md)、処理全体は [Idempotency Flow](docs/idempotency_flow.md) を参照する。

## コードを読む順番

1. `results` Mapに保存するpayload hash・結果と、`created`配列の役割を分ける
2. method・URLの判定を見る
3. header名がNode.js側で小文字の`idempotency-key`になることを見る
4. body読取、`JSON.parse`、payload hash生成を見る
5. keyなし、不正JSON、payload不一致、保存済みkeyの分岐を追う
6. 初回結果を配列とMapへ保存して201を返す箇所を見る

## 現在のresponse

| ケース | Status | 主なbody |
|---|---:|---|
| keyなし | 400 | `idempotency_key_required` |
| 新しいkey | 201 | `replay: false`、新規result |
| 保存済みkey | 200 | `replay: true`、初回result |
| 同じkey・異なるpayload | 409 | `idempotency_payload_conflict` |
| 不正JSON | 400 | `invalid_json` |
| その他のroute | 404 | `not_found` |

## 実装上の重要な限界

- keyと結果はメモリだけにあり、サーバー再起動で消える
- keyの期限・掃除処理がない
- payload hashはparse後のJSONを基にするが、property順序等を正規化するcanonical JSONではない
- 完全に同時のrequestに対する排他性は保証しない
- 処理中・成功・失敗を区別して保存する仕組みがない

決済等の厳密な用途を想定した実装ではなく、基本概念を観察するためのサンプルである。

## 壊して確かめる

- 新しいkey `order-002` で同じbodyを送り、別注文として登録されることを確認する
- `order-001` のままbodyのnameを変え、409になることを確認する
- サーバー再起動後に同じkeyを送り、再登録されることを確認する
- JSON property順序を変えた場合のhashを比較し、canonicalization方針を決める
- request bodyのsize上限とContent-Type validationを追加する
- keyに有効期限を持たせ、期限切れ後の扱いを決める

## 自分の言葉で説明する

- button無効化だけではAPIの二重実行を防ぎきれないのはなぜか
- 同じkeyの再送で初回結果を返す利点は何か
- 同じkey・異なるpayloadを拒否すべきなのはなぜか
- keyをいつまで保持するかは何を基準に決めるか

## 完了条件

- keyなし、初回、同一key再送、新しいkeyの4ケースを確認した
- 不正JSONの400と異なるpayloadの409を確認した
- 再送時にcountとresult.idが増えないことを確認した
- 再起動でkeyが消えることを説明できる
- payload一致確認と不正JSON処理を自動テストで再現した
