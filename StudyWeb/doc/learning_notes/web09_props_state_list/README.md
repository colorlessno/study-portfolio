# web09 props / state / list表示

Reactのprops、state、配列処理、条件付き描画を、タスク一覧の表示フィルタで学ぶテーマです。

## このテーマでできるようになること

- stateを保持するコンポーネントを判断できる
- propsで親から子へデータと関数を渡せる
- `filter`と`map`で表示対象を作れる
- 安定したkeyとempty stateの必要性を説明できる

## 関連資料

1. [要件定義](../../requirements/web09_props_state_list_requirements.md)
2. [基本設計](../../basic_design/web09_basic_design.md)
3. [詳細設計](../../detailed_design/web09_detailed_design.md)
4. [App実装](../../../src/frontend/src/studyweb/systems/web09_props_state_list/src/App.tsx)
5. [共有型](../../../src/frontend/src/studyweb/systems/web09_props_state_list/src/types.ts)

## 資料を見る前の確認問題

- propsとstateの違いは何ですか。
- 子コンポーネントから親のstateを変えたい場合、何をpropsで渡しますか。
- 配列のindexをkeyにすると困るのはどのようなときですか。

## 15分で再開する

1. 開発サーバーを起動する。
2. 「すべて」「未完了」「完了」を順に押し、件数を記録する。
3. `App.tsx`でfilter stateと`filteredTasks`を見る。
4. propsの流れを`App → TaskList → TaskItem`と1行で書く。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run dev
```

型チェックと本番ビルドの確認には次を使います。

```bash
npm run build
```

## コードを読む順番

1. `src/types.ts`で`Task`と`Filter`を見る。
2. `src/App.tsx`で固定データ、state、絞込みを見る。
3. `FilterButtons.tsx`で子から親への通知を見る。
4. `TaskList.tsx`で0件判定と`map`を見る。
5. `TaskItem.tsx`で1件分の条件付き表示を見る。

## データの流れ

```text
FilterButtonsのclick
  ↓ onChange
AppのsetFilter
  ↓ state変更
filteredTasksを再計算
  ↓ props
TaskList
  ↓ task props
TaskItem
```

## 観察ポイント

| 選択 | 期待件数 | 条件 |
|---|---:|---|
| すべて | 4件 | 全件 |
| 未完了 | 2件 | `done === false` |
| 完了 | 2件 | `done === true` |

- 選択中のボタンだけ`active`クラスになるか
- filter変更のたびに表示対象が切り替わるか
- 期限があるタスクだけ期限が表示されるか
- Reactのkey警告がConsoleに出ていないか

## 壊して直す演習

1. `useState<Filter>("all")`を`"active"`へ変え、初期表示との関係を見る。
2. activeの絞込み条件から`!`を外し、表示と条件のずれを見つける。
3. 固定タスクを一時的に空配列にし、empty stateを確認する。
4. `TaskItem`のkeyを一時的に同じ値へし、Consoleの警告を観察する。

## 自分の言葉で説明する

- filter stateを`FilterButtons`ではなく`App`が持つ理由は何ですか。
- propsが下向き、操作通知が上向きに流れる様子を説明してください。
- `useMemo`の依存配列が`[filter]`である理由は何ですか。

## うまく動かないとき

- 画面が起動しない場合は、ターミナルのVite・TypeScriptエラーを最初に確認します。
- ボタンが反応しない場合は、`onClick`、`onChange`、`setFilter`を順に追います。
- 件数が違う場合は、固定データの`done`とfilter条件を表で照合します。

## 学習完了の目安

- [ ] 3つのフィルタと件数を確認した
- [ ] 4コンポーネント間のpropsを図にできた
- [ ] empty stateとkey警告を観察した
- [ ] propsとstateの違いを自分の言葉で説明した
