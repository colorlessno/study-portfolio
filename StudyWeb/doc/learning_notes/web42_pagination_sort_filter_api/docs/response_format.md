# Response Format

## 200 success

```json
{
  "items": [
    {
      "id": 1,
      "name": "Item 1",
      "status": "closed",
      "createdAt": "2026-04-01"
    }
  ],
  "meta": {
    "total": 30,
    "limit": 10,
    "offset": 0
  }
}
```

| 項目 | 意味 |
|---|---|
| `items` | 現在のoffsetから返した最大limit件 |
| `meta.total` | filter後・pagination前の総件数 |
| `meta.limit` | 1回の最大取得件数 |
| `meta.offset` | 先頭から読み飛ばした件数 |

`items.length`と`total`は同じとは限らない。画面側は`total`を使って次ページの有無を判断する。

## 400 validation error

```json
{
  "error": "invalid_order"
}
```

現在の400は不正なorderだけ。実務では安定したerror code、対象parameter、修正可能なmessage等を共通形式で返す。
