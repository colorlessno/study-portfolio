# web02 ブラウザ通信観察

ブラウザがHTMLを起点にCSS、JavaScript、画像を取得する流れを、DevToolsのNetworkタブで観察するテーマです。

## このテーマでできるようになること

- HTMLを開いた後に複数のHTTPリクエストが発生する理由を説明できる
- NetworkのName、Status、Type、Size、Timeを確認できる
- CSS、JavaScript、画像の404を、参照パスから調査できる
- ConsoleのエラーとNetworkの失敗を使い分けられる

## 関連資料

1. [要件定義](../../requirements/web02_browser_network_requirements.md)
2. [基本設計](../../basic_design/web02_basic_design.md)
3. [詳細設計](../../detailed_design/web02_detailed_design.md)
4. [実装](../../../src/frontend/src/studyweb/systems/web02_browser_network/index.html)

資料を順番に読むと、「何を学ぶか → どんな構成か → どう実装したか」を追えます。

## 資料を見る前の確認問題

- HTMLだけを開いても、なぜCSSや画像の通信が発生するでしょうか。
- HTTP 200と404は、それぞれ何を表すでしょうか。
- JavaScriptが動かない場合、NetworkとConsoleのどちらを先に見ますか。

答えを思い出せなくても問題ありません。学習後に同じ問いへ答えます。

## 15分で再開する

1. `index.html`を開く。
2. DevToolsのNetworkタブを開き、ページを再読み込みする。
3. document、stylesheet、script、imageを1件ずつ選ぶ。
4. ボタンを押して、時刻を含むメッセージを確認する。
5. 下の「自分の言葉で説明する」を1問だけ書く。

## 起動方法

実装ディレクトリの`index.html`をブラウザで直接開けます。HTTP通信として観察する場合は、実装ディレクトリで簡易サーバーを起動します。

```bash
python -m http.server 8002
```

ブラウザで`http://localhost:8002`を開きます。Chrome / Edgeでは`F12`または「検証」からDevToolsを開き、必要に応じて`Disable cache`を有効にして再読み込みします。

## コードを読む順番

1. `index.html`で`link`、`script`、`img`の参照先を見る。
2. `styles/style.css`で2列から1列へ変わる条件を見る。
3. `scripts/main.js`でDOM取得、存在確認、click処理を見る。
4. Networkでコード上の参照と実際の通信を対応付ける。

## 観察ポイント

| リソース | Typeの目安 | 画面上の役割 |
|---|---|---|
| `index.html` | document | ページ本体 |
| `styles/style.css` | stylesheet | レイアウトと装飾 |
| `scripts/main.js` | script | ボタン操作 |
| `images/profile-placeholder.svg` | image | プロフィール画像 |
| `images/favicon.svg` | image | タブ用アイコン |

- 各リソースのStatusが成功になっているか
- ファイルサイズと読込時間がリソースごとに違うか
- ボタンを押すたびに確認時刻が更新されるか
- 640px以下でリソース領域が1列になるか

## 壊して直す演習

変更前の値を記録し、確認後は必ず元へ戻します。

1. CSSの参照を一時的に`./styles/missing.css`へ変え、装飾とNetworkの変化を見る。
2. 画像の参照を存在しない名前へ変え、404と画面表示を確認する。
3. `checkButton`のIDをHTML側だけ変更し、Consoleの固定エラーを確認する。
4. `Disable cache`のオン・オフで再読み込み時のSize表示を比較する。

## 自分の言葉で説明する

- HTMLから追加リソースが読み込まれる流れを3文で説明してください。
- Networkの404から、どの情報を使って修正箇所を探しますか。
- `defer`がこのページで必要な理由は何ですか。

## うまく動かないとき

- 404の場合は、NameとInitiatorを見てHTMLの参照元を確認します。
- ボタンだけ動かない場合は、scriptのStatusとConsoleの両方を確認します。
- `[Smart Unit Converter]`等のログはブラウザ拡張機能由来の可能性があります。シークレットウィンドウでも再確認します。

## 学習完了の目安

- [ ] 5種類のリソースをNetwork上で特定できた
- [ ] CSS、JavaScript、画像の読込失敗を1回ずつ切り分けた
- [ ] StatusとTypeの意味を自分の言葉で説明した
- [ ] 壊した参照とIDを元に戻した
