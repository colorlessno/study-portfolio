# web01_static_first_page

HTML、CSS、JavaScriptの役割分担を、最小の自己紹介ページで確認する学習テーマです。学習時間の目安は、動作確認だけなら15分、コードの変更と説明まで行うなら45〜90分です。

## このテーマでできるようになること

- HTMLがページ構造、CSSが見た目、JavaScriptが動作を担当すると説明できる
- HTMLからCSSとJavaScriptを読み込む相対パスをたどれる
- ボタンクリックからDOM更新までの流れをコードで追える
- ファイル参照や要素IDを意図的に壊し、原因をDevToolsで確認できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [web01 要件定義](../../requirements/web01_static_first_page_requirements.md) |
| 基本設計 | [web01 基本設計](../../basic_design/web01_basic_design.md) |
| 詳細設計 | [web01 詳細設計](../../detailed_design/web01_detailed_design.md) |
| 実装 | [web01 ソース](../../../src/frontend/src/studyweb/systems/web01_static_first_page/) |

## 資料を見る前の確認問題

1. ブラウザは、どこに書かれた指定を使ってCSSを読み込みますか。
2. ボタンが押されたことをJavaScriptはどのように受け取りますか。
3. HTMLの要素とJavaScriptの処理は、何を手掛かりに対応しますか。

答えが曖昧でも、そのまま次へ進みます。実行後にもう一度答えます。

## 15分で再開する

1. [実装フォルダ](../../../src/frontend/src/studyweb/systems/web01_static_first_page/)の `index.html` をブラウザで開く。
2. ボタンを3回押し、メッセージとクリック回数の変化を予想と比較する。
3. DevToolsのElementsで `messageButton` と `messageOutput` を探す。
4. DevToolsのSourcesまたはエディターで、そのIDを使うJavaScriptを探す。

`file://` で直接開いた場合、ブラウザや拡張機能によってはConsoleに `file:` URLの警告が出ることがあります。ページ表示とボタン操作が動いていれば、このサンプルのJavaScriptエラーではありません。

## コードを読む順番

1. [`index.html`](../../../src/frontend/src/studyweb/systems/web01_static_first_page/index.html): 画面に存在する要素と外部ファイルの読込順を確認する
2. [`script.js`](../../../src/frontend/src/studyweb/systems/web01_static_first_page/script.js): 要素取得、イベント登録、DOM更新を追う
3. [`styles.css`](../../../src/frontend/src/studyweb/systems/web01_static_first_page/styles.css): HTMLのclassや要素との対応を見る

## 観察ポイント

- HTMLには見出し、自己紹介文、リスト、ボタン、結果表示領域がある
- CSSによって余白、背景色、カード風の見た目が反映される
- JavaScriptによって、ボタンを押すたびにメッセージとクリック回数が変わる
- `<script defer>` によって、HTML解析後にイベント登録が行われる

## 壊して直す演習

変更前に結果を予想し、変更後は `git diff` で差分を確認します。

1. `index.html` の `styles.css` を `style.css` に変え、表示がどう変わるか確認して元に戻す。
2. `messageButton` のIDを片方のファイルだけ変更し、Consoleのエラーを確認して直す。
3. クリック時のメッセージまたは回数の増え方を変更する。

## 自分の言葉で説明する

- `index.html` を開いてから画面が操作可能になるまでの流れ
- CSSが読み込めなくてもHTMLとJavaScriptが動く理由
- JavaScriptの要素IDがHTMLと一致している必要がある理由

## うまく動かないとき

- 見た目が反映されない場合は、`index.html` の `<link>` と実際のファイル名を比較する
- ボタンを押しても変わらない場合は、`<script src="./script.js" defer>` を確認する
- Consoleに `web01: required element was not found.` があったら、HTMLとJavaScriptのIDを比較する

## 学習完了の目安

- レベル1（再現）: ページを開き、ボタン操作を確認できる
- レベル2（説明）: HTML、CSS、JavaScriptの役割と読込関係を説明できる
- レベル3（改造）: 要素や動作を1つ追加し、差分と結果を説明できる

次は [web02 Browser Network](../web02_browser_network/README.md) で、ブラウザが各ファイルを取得する様子をNetworkタブから確認します。
