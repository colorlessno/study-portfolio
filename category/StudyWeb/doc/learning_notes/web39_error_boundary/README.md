# web39 Error Boundary

依存パッケージを使わず、同期的な描画処理を `try / catch` で保護して fallback UI を出す概念サンプル。React の Error Boundary を実装したものではなく、本格実装へ進む前に「画面の一部が失敗しても復旧導線を残す」という考え方を確認する。

## このテーマで身につけること

- 利用者向け fallback と開発者向けエラー情報を分けて考える
- 例外の影響範囲を画面全体ではなく一部へ限定する理由を説明する
- 同期的な `try / catch` と React Error Boundary の違いを理解する
- 捕捉できないエラーを把握し、別の処理が必要だと判断する

## 10分で再開する

Docker で静的画面を配信する。

```powershell
cd category/StudyWeb\src\frontend\static\studyweb\systems\web39_error_boundary
docker build -t studyweb-web39 .
docker run --rm -p 3039:80 studyweb-web39
```

`http://localhost:3039/app/` を開き、DevTools の Console も表示する。終了は `Ctrl+C`。

簡単な確認なら `app/index.html` を直接開ける。構文確認は次を使う。

```powershell
node --check app/src/main.js
```

## 最初に試す順番

1. 初期表示で `正常表示` が出ることを確認する
2. `throw` を押し、画面全体ではなく panel 内だけが fallback に変わることを見る
3. fallback に例外メッセージと再読み込みボタンがあることを確認する
4. `再読み込み` で正常表示へ戻ることを確認する
5. `normal` を押した場合は例外を発生させず再描画できることを見る

概念と本格版との差は [Error Boundary Behavior](docs/error_boundary_behavior.md) に整理している。

## コードを読む順番

1. `app/index.html` で正常・例外ボタンと、保護対象の `div#panel` を確認する
2. `render(shouldThrow)` の `try` 内で正常表示と意図的例外を比較する
3. `catch` 内で fallback UI を組み立てる処理を見る
4. 2つの click handler が `render` の引数を変える箇所を見る
5. 初期 `render(false)` で正常画面を表示する流れを追う

## 現実装の境界

| 項目 | 現在のサンプル | React Error Boundary本格版 |
|---|---|---|
| 実装方法 | 関数内の `try / catch` | class componentまたは対応ライブラリ |
| 捕捉対象 | `render` 内の同期例外 | 子componentのrender・一部lifecycle等 |
| fallback | `innerHTML` で置換 | stateに応じてcomponentを描画 |
| 復旧 | ページ再読み込み | reset、再試行、再マウント等 |
| ログ | なし | 監視・ログ基盤への記録を検討 |

React Error Boundary でも、event handler、`setTimeout` などの非同期 callback、サーバー側のエラーを自動ですべて捕捉できるわけではない。

## 観察ポイント

- panel の外にある見出しと操作ボタンは、fallback 表示後も残る
- 現在の例外文は固定の学習用文字列だが、`error.message` を利用者へ直接表示している
- 本番では内部情報を画面へ出しすぎず、調査用情報はログへ分離する
- 再読み込みは単純な復旧方法だが、入力途中の値なども失われる
- fallback を置く範囲が大きすぎると、無関係な画面まで操作不能になる

## 壊して確かめる

- fallback から `<pre>${error.message}</pre>` を外し、Console へ記録する形へ変える
- 再読み込みではなく `render(false)` で復旧する `再試行` ボタンを作る
- panel の外にも状態表示を追加し、どこまで影響が限定されるか確認する
- `setTimeout(() => { throw new Error('async'); }, 0)` を試し、現在の `try / catch` で捕捉できない理由を調べる
- React の Error Boundary 版へ置き換え、event handler のエラーは別処理が必要なことを確認する

## 自分の言葉で説明する

- fallback UI は誰に何を伝えるための画面か
- 利用者向け表示と開発者向けログを分ける理由は何か
- 保護範囲を画面の一部に限定する利点は何か
- 現在のサンプルと React Error Boundary は何が違うか

## 完了条件

- 正常表示、例外、fallback、復旧を一通り再現した
- 捕捉できる同期例外と、捕捉できない非同期例外を比較した
- 例外詳細を利用者画面から分離する改造を行った
- React Error Boundary でも捕捉対象に限界があることを説明できる
