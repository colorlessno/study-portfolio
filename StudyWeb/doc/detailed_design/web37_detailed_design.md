# web37 業務フォーム完全版 詳細設計

## 0. 関連文書

- `../requirements/web37_business_form_complete_requirements.md`
- `../basic_design/web37_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web37_business_form_complete/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web37_business_form_complete/
  README.md
  docs/form_state.md
  docs/validation_rules.md
```

## 2. 画面項目

| 項目 | 種別 | 役割 |
|---|---|---|
| 顧客名 | input | 必須入力 |
| メール | input | 必須・形式確認 |
| 備考 | textarea | 任意・200文字以内 |
| 確認 | submit button | 検証と送信処理を開始 |
| 項目別エラー | span | 各入力の修正内容を表示 |
| 処理結果 | pre | 送信中・成功内容を表示 |

## 3. Validationルール

| 項目 | 現在の判定 |
|---|---|
| 顧客名 | `trim()` 後が空ならエラー |
| メール | `^[^@]+@[^@]+$` に一致しなければエラー |
| 備考 | 201文字以上ならエラー |

メール判定は学習用の最小実装であり、メールアドレス仕様を完全に検証するものではない。

## 4. 処理手順

1. submit event の既定動作を停止する。
2. 前回の項目別エラーを消去する。
3. `validate()` で入力値を検証する。
4. エラーがあれば項目別メッセージを表示し、送信処理へ進まない。
5. 正常なら submit button を無効化し、送信中を表示する。
6. 400ミリ秒の待機後、成功内容を表示する。
7. submit button を再び有効化する。

## 5. 状態

| 状態 | 実装状況 | 表示・制御 |
|---|---|---|
| input | 実装済み | フォーム入力 |
| validation error | 実装済み | 項目別エラー |
| submitting | 実装済み | 送信中、button無効 |
| success | 実装済み | 顧客名・メール |
| confirm | 未実装 | 送信前の確認画面 |
| form error | 未実装 | 通信・処理失敗と再試行 |

## 6. 要件との差分

- 確認ステップはまだなく、正常入力から送信へ直接進む。
- 送信失敗を発生させる分岐とフォーム全体エラーはない。
- 最初のエラー項目へフォーカスを移す処理はない。
- API・DBは対象外で、待機処理は通信を模擬している。

## 7. 確認手順

1. 空欄送信で顧客名・メールの項目別エラーを確認する。
2. 不正なメールと201文字の備考で各ルールを確認する。
3. 正常入力で送信中表示とbutton無効化を確認する。
4. 待機後の成功表示とbutton再有効化を確認する。
5. 未実装状態を学習ノートの発展課題として1つ以上追加する。

## 8. 完了条件

- 現在の4状態を再現できる。
- validationに失敗した場合は送信処理へ進まない。
- 送信待機中の二重操作を画面上で防げる。
- 実装済み状態と要件上の未実装状態を説明できる。
