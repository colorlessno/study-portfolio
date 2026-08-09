# Query Parameters

| Parameter | 例 | 現在の動作 | 改善するvalidation |
|---|---|---|---|
| `keyword` | `keyword=Item%201` | nameの部分一致 | 文字数上限等 |
| `status` | `status=open` | 完全一致 | `open / closed`に限定 |
| `sort` | `sort=createdAt` | 指定propertyで比較 | 許可keyに限定 |
| `order` | `order=desc` | `asc / desc` | 実装済み |
| `limit` | `limit=5` | 既定10、1〜50へ補正 | 整数・形式不正を400 |
| `offset` | `offset=5` | 既定0、負数は0へ補正 | 0以上の整数 |

## 組合せ例

```text
/items?keyword=1&status=open&sort=createdAt&order=desc&limit=5&offset=0
```

filter、sortを適用した後で、offsetからlimit件を切り出す。

## 不正値の確認

```text
/items?order=sideways
/items?limit=abc
/items?offset=abc
/items?sort=unknown
/items?status=unknown
```

現在400になるのは不正なorderだけ。他のケースも入力仕様を決めてvalidationすることが発展課題。
