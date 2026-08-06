# web06 入力フォームとバリデーション

HTMLフォーム、submitイベント、JavaScriptによる入力検証、項目別エラー表示を学ぶテーマです。データの保存と送信は行いません。

## このテーマでできるようになること

- labelと入力要素を対応付けられる
- submitを止めてJavaScriptで入力値を検証できる
- 項目ごとのエラーとフォーム全体の結果を表示できる
- reset後に入力値とメッセージを初期状態へ戻せる

## 関連資料

1. [要件定義](../../requirements/web06_form_basic_requirements.md)
2. [基本設計](../../basic_design/web06_basic_design.md)
3. [詳細設計](../../detailed_design/web06_detailed_design.md)
4. [HTML実装](../../../src/frontend/src/studyweb/systems/web06_form_basic/index.html)
5. [JavaScript実装](../../../src/frontend/src/studyweb/systems/web06_form_basic/script.js)

## 資料を見る前の確認問題

- `label[for]`と入力要素のIDを対応させる理由は何ですか。
- `preventDefault()`を呼ばないsubmitは何をしますか。
- クライアント側のメール形式チェックだけで、アドレスの実在を保証できますか。

## 15分で再開する

1. すべて空のまま送信する。
2. メールだけ`sample`と入力して再送信する。
3. 4項目を正常に入力して送信する。
4. リセットし、入力値とすべてのメッセージが消えることを確認する。

## 起動方法

実装ディレクトリの`index.html`をブラウザで開きます。実際のメール送信やAPI通信は行いません。

## コードを読む順番

1. `index.html`でform、4入力、4エラー領域、結果領域を見る。
2. `novalidate`を付けている理由を確認する。
3. `script.js`で`fields`と`errors`の対応を見る。
4. `setError`、`clearMessages`、`validate`を順に読む。
5. submitとresetのイベント処理を読む。

## 入力チェック

| 項目 | 正常条件 | エラーの観察例 |
|---|---|---|
| 名前 | `trim()`後が空でない | 空文字、空白だけ |
| メール | 空でなく簡易パターンに一致 | `sample`、`a@b` |
| 問い合わせ種別 | いずれかを選択 | 初期選択のまま |
| 本文 | `trim()`後が空でない | 空文字、空白だけ |

## 観察ポイント

- 1回の送信ですべての不正項目が表示されるか
- 前回のエラーが次の検証前に消されるか
- 正常時の文言に「実際の送信は行っていない」と出るか
- reset直後に入力とエラーと結果がすべて消えるか
- エラー表示の有無で画面が大きく跳ねないか

## 壊して直す演習

1. `event.preventDefault()`を一時的に外し、送信後のページ挙動を見る。
2. `nameError`のIDをHTML側だけ変え、初期化時の固定エラーを見る。
3. `clearMessages()`の呼出しを外し、古いエラーが残る様子を見る。
4. `trim()`を外し、空白だけの入力がどう判定されるか比較する。

## 自分の言葉で説明する

- submitから結果表示までの処理を順番に説明してください。
- 項目別エラーとフォーム全体の結果を分ける理由は何ですか。
- このクライアント側検証を本番の安全対策として十分と考えてはいけない理由は何ですか。

## うまく動かないとき

- `web06: required element was not found.`が出たら、入力とエラー領域のIDを照合します。
- エラーが消えない場合は、`clearMessages()`の呼出し位置を確認します。
- リセット後だけ表示が残る場合は、resetイベントと`setTimeout`を確認します。

## 学習完了の目安

- [ ] 必須、メール形式、正常、resetを一通り確認した
- [ ] `fields`と`errors`の対応を説明できた
- [ ] `preventDefault`と`trim`の故障を観察して直した
- [ ] ブラウザ内だけの検証・未送信であることを説明できた
