# CSV Format

## 現在の期待形式

```csv
code,name,price
P001,Pen,120
P002,Notebook,300
```

| Column | 必須 | 現在のvalidation |
|---|---|---|
| `code` | はい | 空文字でない |
| `name` | はい | 空文字でない |
| `price` | はい | `Number()`がNaNでない |

headerの列順は任意で、追加列もobjectへ含める。

## 現在扱えない例

```csv
code,name,price
P001,"Pen, Blue",120
```

単純なcomma splitでは引用符内commaを正しく扱えない。また、price空文字は数値0として解釈されるため追加validationが必要。

実務ではdelimiter、quote、改行、BOM、文字コード、空行、列数、最大行数等も仕様化する。
