# web09 詳細設計## props / state / list 表示

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web09_props_state_list/
├── package.json
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  └── components/
│      ├── FilterButtons.tsx
│      ├── TaskList.tsx
│      └── TaskItem.tsx
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主なprops/state |
|---|---|---|
| App | 親コンポーネント| `tasks`, `filter` |
| FilterButtons | フィルタ操作| `currentFilter`, `onChange` |
| TaskList | 一覧表示 | `tasks` |
| TaskItem | 1件表示 | `task` |

## 3. API 詳細

HTTP API は使用しないpropsとstateをIFとして扱い
## 4. 詳細API I/O 定義

### 4.1 型定義

| 型| 定義 |
|---|---|
| `Task` | `{ id: string; title: string; done: boolean; dueDate?: string }` |
| `Filter` | `'all' \| 'active' \| 'done'` |

### 4.2 props

| コンポーネント| props | 説明|
|---|---|---|
| FilterButtons | `currentFilter`, `onChange` | 表示条件 |
| TaskList | `tasks` | 表示対象配列 |
| TaskItem | `task` | 1件表示 |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| filter | `all/active/done` のみ |
| tasks | 配列であること |
| Task.title | 空文字にしない|

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `invalid_filter` | 許可外filter | TypeScriptで検出 |
| `empty_tasks` | 表示対象0件 | 空メテージ表示 |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| filter | union型|
| list rendering | `map` + `key` |
| empty state | 条件の|

## 8. データベース詳細

DBは使用しないタスクは固定の列。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- React key 警告が出ないよう `id` を key にする
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- 親から子へ一方向にデータを渡す
- フィルタ処理は `tasks.filter(...)` で行う
- 条件表示は JSX 内容明確に列る
