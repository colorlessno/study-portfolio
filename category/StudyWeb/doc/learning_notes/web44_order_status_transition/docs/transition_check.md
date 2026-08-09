# Transition Check

## 許可遷移

```text
draft -> confirmed -> shipped -> completed
```

各操作で`更新成功`、現在status、履歴の追加を確認する。

別の確認として、再読み込み後に次を試す。

```text
draft -> canceled
```

## 不正遷移

- `draft -> shipped`
- `confirmed -> draft`
- `shipped -> canceled`
- `completed -> confirmed`
- `canceled -> draft`

不正時は業務エラーを表示し、現在statusとhistoryが変化しないことを確認する。

## 履歴の改善観点

現在はstatus名だけを保存する。実務向けには変更前・変更後、日時、操作者、理由、request ID等を検討する。
