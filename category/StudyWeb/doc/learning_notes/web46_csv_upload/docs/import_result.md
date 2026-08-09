# Import Result

## 現在の出力

```json
{
  "preview": [],
  "success": 0,
  "errors": []
}
```

| 項目 | 内容 |
|---|---|
| `preview` | parseした先頭3行 |
| `success` | errorが0件なら全行数、それ以外は0 |
| `errors` | missing columnと行単位error |

## 発展後の結果案

| 項目 | 目的 |
|---|---|
| total | 入力行数 |
| succeeded | 取込成功行数 |
| failed | 失敗行数 |
| skipped | 重複等で除外した行数 |
| rowErrors | 行番号、列、error code、修正message |

全件成功だけを許可するか、一部成功を許可するかを決める。一部成功では再実行時の重複防止、全件失敗ではtransaction・rollbackが重要になる。
