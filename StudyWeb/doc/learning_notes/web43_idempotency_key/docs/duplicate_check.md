# Duplicate Check

## 初回

```powershell
curl.exe -i -X POST http://localhost:3043/orders -H "Content-Type: application/json" -H "Idempotency-Key: order-001" -d "{\"name\":\"Sample\"}"
```

- Status: 201
- `replay`: false
- `result.id`: 1
- `count`: 1

## 同じkeyで再送

同じコマンドを実行する。

- Status: 200
- `replay`: true
- `result.id`: 初回と同じ
- `count`: 増えない

## 比較ケース

- `Idempotency-Key`を外すと400になる
- keyを`order-002`へ変えると新しい注文になる
- `order-001`のままbodyを変えても現在は初回結果が返る
- サーバー再起動後はMapが空になり、`order-001`でも再登録される
