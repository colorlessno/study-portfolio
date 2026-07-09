# web09_props_state_list

React の props、state、配列の `map`、条件表示を確認するタスク一覧サンプルです。

## 起動方法

```bash
npm install
npm run dev
```

## 確認ポイント

- 親の `App` が `filter` state を持つ
- `FilterButtons` から `onChange` で親の state を更新する
- `TaskList` が `tasks` props を受け取る
- `TaskItem` が `task` props を受け取る
- `map` と `key` で一覧表示する
