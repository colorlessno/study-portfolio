# File Validation

| 検証 | 現在の条件 | 限界・追加確認 |
|---|---|---|
| extension | filenameが`.pdf`で終わる | 名前は変更・偽装できる |
| MIME type | 空でなければ`application/pdf` | browser提供値を信頼しきれない |
| size | 1MiB以下 | 0byte、境界値、server上限も確認 |
| signature | 未実装 | 先頭bytesが`%PDF-`か確認 |
| malware | 未実装 | scan・隔離・sandboxを検討 |
| PDF品質 | 未実装 | 暗号化・破損・page数等 |

## Validationの層

1. client側: 早いfeedbackと不要uploadの削減
2. server側: 同じ条件を信頼できる環境で再検証
3. 保存前後: signature、scan、hash、隔離
4. 後続処理前: PDF parser・OCR・AI入力としての品質確認

`accept`属性はfile pickerの候補を絞るUI機能であり、security boundaryではない。
