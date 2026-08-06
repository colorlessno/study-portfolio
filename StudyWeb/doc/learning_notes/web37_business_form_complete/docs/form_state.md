# Form State

## 現実装

```text
input
  ├─ invalid -> validation error -> input
  └─ valid   -> submitting -> success
```

現在は項目別 validation error、送信中、成功を確認できる。

## 要件上の目標

```text
input -> validating -> confirm -> submitting
                                ├─ success
                                └─ form error -> input / retry
```

確認画面、送信失敗、フォーム全体エラー、エラー項目へ戻る導線は今後の実装対象。
