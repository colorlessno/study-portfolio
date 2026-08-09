# web04 素のJavaScriptによるDOM操作

DOM要素の取得、イベント登録、状態変更、表示更新を、フレームワークを使わず確認するテーマです。

## このテーマでできるようになること

- JavaScriptからHTML要素を取得できる
- `addEventListener`でイベントを登録できる
- 変数に保持した状態と画面表示を対応付けられる
- DOM取得失敗をConsoleから調査できる

## 関連資料

1. [要件定義](../../requirements/web04_vanilla_dom_requirements.md)
2. [基本設計](../../basic_design/web04_basic_design.md)
3. [詳細設計](../../detailed_design/web04_detailed_design.md)
4. [HTML実装](../../../src/frontend/src/studyweb/systems/web04_vanilla_dom/index.html)
5. [JavaScript実装](../../../src/frontend/src/studyweb/systems/web04_vanilla_dom/script.js)

## 資料を見る前の確認問題

- DOMとは何をJavaScriptのオブジェクトとして表したものでしょうか。
- HTMLのIDと`getElementById`の文字列が違うと何が起きますか。
- `textContent`と`innerHTML`は何が違いますか。

## 15分で再開する

1. `index.html`を開く。
2. 変更ボタンを3回押し、回数を見る。
3. リセットし、もう一度変更ボタンを押す。
4. `script.js`で上記の動きを作る行を指差す。

## 起動方法

実装ディレクトリの`index.html`をブラウザで開きます。ビルドと外部通信は不要です。

## コードを読む順番

1. `index.html`で3つのIDと`defer`を確認する。
2. `script.js`でDOM取得とnullチェックを見る。
3. `changeCount`と`initialMessage`の役割を見る。
4. 2つのclickイベントを順に読む。
5. `styles.css`で操作領域と結果領域のclassを確認する。

## 観察ポイント

- ページ読込時の`changeCount`は0か
- 変更ボタンごとに状態が1増え、表示も同じ値になるか
- リセットで状態と表示の両方が初期化されるか
- HTMLの`onclick`ではなくJavaScriptでイベントを登録しているか
- 表示更新が`textContent`で行われているか

## 壊して直す演習

1. HTML側の`changeButton`を一時的に別IDへ変え、Consoleの固定エラーを見る。
2. `script`から`defer`を外し、head内で早く実行された場合のDOM取得を観察する。
3. `changeCount += 1`を一時的に無効化し、状態と表示の関係を確認する。
4. リセット処理の`changeCount = 0`だけを外し、見た目と内部状態がずれる様子を見る。

## 自分の言葉で説明する

- 「要素取得 → イベント登録 → 状態変更 → DOM更新」を4文で説明してください。
- `defer`がないとDOM取得に失敗し得るのはなぜですか。
- リセット時に文言だけでなく`changeCount`も戻す理由は何ですか。

## うまく動かないとき

- `web04: required element was not found.`が出たら3つのIDを照合します。
- ボタンで回数が変わらない場合は、イベント登録と`changeCount`更新を確認します。
- Consoleにエラーがなく表示だけ違う場合は、`resultText.textContent`を確認します。

## 学習完了の目安

- [ ] 3つのDOM取得先を説明できた
- [ ] 変更とリセットの状態遷移を説明できた
- [ ] IDまたは`defer`の故障をConsoleから直せた
- [ ] 演習で変更したコードを元に戻した
