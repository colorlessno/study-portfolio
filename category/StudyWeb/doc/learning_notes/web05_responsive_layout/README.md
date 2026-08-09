# web05 レスポンシブなカード一覧

CSS Grid、Flexbox、メディアクエリを組み合わせ、画面幅に応じて列数が変わる一覧を学ぶテーマです。

## このテーマでできるようになること

- Gridで均等なカード列を作れる
- Flexboxでカード内部のボタン位置を揃えられる
- ブレークポイントの前後で表示を検証できる
- 横スクロールの原因をDevToolsで調査できる

## 関連資料

1. [要件定義](../../requirements/web05_responsive_layout_requirements.md)
2. [基本設計](../../basic_design/web05_basic_design.md)
3. [詳細設計](../../detailed_design/web05_detailed_design.md)
4. [HTML実装](../../../src/frontend/src/studyweb/systems/web05_responsive_layout/index.html)
5. [CSS実装](../../../src/frontend/src/studyweb/systems/web05_responsive_layout/styles.css)

## 資料を見る前の確認問題

- GridとFlexboxは、それぞれどの範囲の配置に向いていますか。
- `minmax(0, 1fr)`の0は何を防いでいますか。
- メディアクエリの境界値は、どの幅で確認すべきでしょうか。

## 15分で再開する

1. `index.html`を開く。
2. DevToolsのデバイスモードを開く。
3. 821px、820px、561px、560pxで列数を記録する。
4. 6枚のボタンの下端が揃っている理由をCSSから探す。

## 起動方法

実装ディレクトリの`index.html`をブラウザで開きます。JavaScriptとビルド処理は使用しません。

## コードを読む順番

1. `index.html`でheader、6件のarticle、footerを見る。
2. `styles.css`で`.card-grid`の3列指定を見る。
3. `.card`のFlexboxと`button`の`margin-top: auto`を見る。
4. 820pxと560pxのメディアクエリを見る。
5. DevToolsで適用中のCSSルールを確認する。

## 観察ポイント

| 画面幅 | 期待する列数 |
|---:|---:|
| 821px以上 | 3列 |
| 561px〜820px | 2列 |
| 560px以下 | 1列 |

- すべてのカード幅が均等か
- 説明の長さが違ってもボタン位置が揃うか
- 560px以下でbodyの余白も縮むか
- どの幅でも横スクロールが発生しないか

## 壊して直す演習

1. `.card-grid`の`minmax(0, 1fr)`を`1fr`へ変え、長い文字列を入れて差を観察する。
2. `.card`の`min-width: 0`を外し、はみ出しの可能性を確認する。
3. ボタンの`margin-top: auto`を外し、カードごとの位置を比較する。
4. 820pxのメディアクエリを無効にし、タブレット幅で3列が窮屈になる様子を見る。

## 自分の言葉で説明する

- 一覧にはGrid、カード内部にはFlexboxを使う理由は何ですか。
- 820pxと560pxの境界をどのように検証しましたか。
- 横スクロールを防ぐために使っている指定を3つ挙げてください。

## うまく動かないとき

- 列数が変わらない場合は、viewport設定と適用中のメディアクエリを確認します。
- 横にはみ出す場合は、幅が固定された要素、長い文字列、`min-width`を確認します。
- ボタン位置が揃わない場合は、カードのFlexboxと`margin-top: auto`を確認します。

## 学習完了の目安

- [ ] 4つの境界幅で列数を確認した
- [ ] GridとFlexboxの役割分担を説明できた
- [ ] 横スクロールの故障を作って元へ戻した
- [ ] JavaScriptなしでレスポンシブ表示が成立する理由を説明した
