# web03 ファイルパスと共通資産

2つのHTMLから同じCSS、JavaScript、画像を相対パスで参照し、ファイル階層とURLの関係を学ぶテーマです。

## このテーマでできるようになること

- 相対パスが「現在のHTMLの場所」を起点に解決されることを説明できる
- `./`と`../`を使い分けられる
- 複数ページで同じCSSとJavaScriptを共有できる
- Networkの404から誤ったパスを修正できる

## 関連資料

1. [要件定義](../../requirements/web03_file_path_assets_requirements.md)
2. [基本設計](../../basic_design/web03_basic_design.md)
3. [詳細設計](../../detailed_design/web03_detailed_design.md)
4. [トップページ実装](../../../src/frontend/src/studyweb/systems/web03_file_path_assets/index.html)
5. [Aboutページ実装](../../../src/frontend/src/studyweb/systems/web03_file_path_assets/about.html)

## 資料を見る前の確認問題

- `index.html`と`styles/style.css`の位置関係を図にできますか。
- `./images/avatar.svg`の`./`は、どのディレクトリを指しますか。
- Windowsで動くパスがLinuxで失敗する場合、何を疑いますか。

## 15分で再開する

1. `index.html`を開き、バナーとアバターを確認する。
2. ボタンを押し、結果に`index.html`が出ることを確認する。
3. `about.html`へ移動し、同じCSSとJavaScriptが使われることを確認する。
4. HTMLと参照先を紙やメモに矢印で1本だけ描く。

## 起動方法

`index.html`を直接開くか、実装ディレクトリで簡易HTTPサーバーを起動します。

```bash
python -m http.server 8003
```

ブラウザで`http://localhost:8003`を開きます。`file://`で出る拡張機能やブラウザ由来の警告と、サンプル自身のエラーを区別しやすいため、Network観察にはHTTPサーバーが向いています。

## コードを読む順番

1. ディレクトリ構成を見てHTMLと資産の位置関係を確認する。
2. `index.html`のCSS、JavaScript、画像、Aboutへの参照を見る。
3. `about.html`で同じ参照が使える理由を考える。
4. `scripts/main.js`で現在のファイル名を表示する処理を見る。
5. `styles/style.css`で両ページ共通のclassを確認する。

## 正しいパスの例

```html
<link rel="stylesheet" href="./styles/style.css">
<script src="./scripts/main.js" defer></script>
<img src="./images/avatar.svg" alt="アバター画像">
```

参照先を`./style.css`、`./main.js`、`./avatar.svg`とすると、実ファイルが各サブディレクトリにあるため404になります。

## 観察ポイント

- 2ページのCSSとJavaScriptのURLが同じか
- ページ遷移後にdocumentが変わり、共通資産が再利用・再取得されるか
- ボタンの結果が現在のHTMLファイル名になるか
- 560px以下でカードが1列になるか
- ファイル名の大文字小文字が実ファイルと一致しているか

## 壊して直す演習

1. `index.html`のCSSパスを`./style.css`へ変え、404になったURLを読む。
2. `about.html`のJavaScriptパスだけを`../scripts/main.js`へ変え、ページごとの差を確認する。
3. `avatar.svg`の大文字小文字を参照側だけ変え、環境差が生まれる理由を考える。
4. `.path-message`のclassを片方のHTMLだけ変え、ボタンクリック時のConsoleを見る。

## 自分の言葉で説明する

- 相対パスの起点は何ですか。
- `./`と`../`の違いを、ディレクトリ図を使って説明してください。
- 2ページで同じCSSを共有する利点と注意点は何ですか。

## うまく動かないとき

- Networkの404 URLと実際のディレクトリ構成を1階層ずつ比較します。
- 片方のページだけ失敗する場合は、失敗したHTML内の参照を確認します。
- scriptは200なのに動かない場合は、Consoleとclass名を確認します。

## 学習完了の目安

- [ ] 2ページの全資産が正常に読み込まれた
- [ ] 誤った相対パスをNetworkから修正できた
- [ ] `./`と`../`を図で説明できた
- [ ] 変更したパスとclassを元に戻した
