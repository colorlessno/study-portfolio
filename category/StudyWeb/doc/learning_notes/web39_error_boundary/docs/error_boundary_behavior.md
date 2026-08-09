# Error Boundary Behavior

## 情報の分離

| 対象 | 表示・記録する内容 |
|---|---|
| 利用者 | 操作を継続できないこと、再試行・再読み込み等の復旧方法 |
| 開発者 | 例外名、message、stack、発生画面、操作・request ID等 |

内部の例外詳細を利用者画面へそのまま表示せず、調査情報はログへ分離する。

## 現在のサンプル

- 同期関数内の `try / catch` で概念を再現している
- panel 内だけを fallback UI に置き換える
- 再読み込みで正常状態へ戻す
- 固定の学習用 `error.message` を画面に出しているため、本番向けには分離が必要

## React本格版

React では class component または対応ライブラリで Error Boundary を実装する。子componentのrender等を保護できるが、event handler、非同期callback、サーバー側例外まで自動ですべて捕捉する仕組みではない。
