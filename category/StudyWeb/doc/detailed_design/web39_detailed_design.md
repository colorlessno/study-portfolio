# web39 Error Boundary 詳細設計

## 0. 関連文書

- `../requirements/web39_error_boundary_requirements.md`
- `../basic_design/web39_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web39_error_boundary/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web39_error_boundary/
  README.md
  docs/error_boundary_behavior.md
```

## 2. 現在の位置付け

依存パッケージを使わず、同期関数内の `try / catch` でfallback表示を再現する概念サンプルとする。React Error Boundary自体は未実装で、例外の影響範囲と復旧導線を理解することを目的とする。

## 3. 画面・処理要素

| 要素 | 役割 |
|---|---|
| `normal` button | 正常描画を要求する |
| `throw` button | 意図的な同期例外を要求する |
| `panel` | 正常表示またはfallbackの描画領域 |
| `render(false)` | 正常内容を描画する |
| `render(true)` | 例外を発生させ、catchへ移る |
| fallback | 利用者向け説明、再読み込み、学習用message |

## 4. 処理手順

1. 初期表示で `render(false)` を呼ぶ。
2. normal操作ではpanelへ正常内容を描画する。
3. throw操作では`Error`を同期的に発生させる。
4. `catch` が例外を受け、panelだけをfallbackへ置き換える。
5. 再読み込み操作でページ全体を初期状態へ戻す。

## 5. 情報表示

現在は固定の学習用 `error.message` をfallbackへ表示する。本番実装では、利用者には安全な概要と復旧方法を示し、message・stack・操作情報等はログ・監視へ分離する。

## 6. 捕捉範囲と差分

- 現在の `try / catch` は `render` 内で同期的に投げた例外だけを捕捉する。
- `setTimeout` 等の非同期callbackで後から発生した例外は、このcatchの対象外となる。
- React本格版では保護対象componentをError Boundaryで囲む。
- React Error Boundaryでもevent handler、非同期処理、サーバー側例外をすべて自動捕捉するわけではない。
- 現在は開発者向けログ送信とresetによる部分復旧を実装していない。

## 7. 確認手順

1. 正常表示を確認する。
2. throw操作でpanelだけがfallbackになることを確認する。
3. 見出し・操作buttonがpanelの外に残ることを確認する。
4. 再読み込みで復旧する。
5. 非同期例外を追加し、現在のcatchでは捕捉できないことを確認する。

## 8. 完了条件

- 画面全体を真っ白にせずfallbackを表示できる。
- 利用者向け表示と開発者向け情報を分けて説明できる。
- 同期的なtry/catchとReact Error Boundaryを混同しない。
- Error Boundaryの捕捉対象には限界があると説明できる。
