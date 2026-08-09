# web22 詳細設計## TanStack Query によるAPIデータ取得
---

## 1. 実装ディレクトリ構成

```text
src/backend/src/studyweb/systems/web22_tanstack_query/backend/ and src/frontend/src/studyweb/systems/web22_tanstack_query/frontend/ and src/infra/compose/web22_tanstack_query/
├── docker-compose.yml
├── frontend/
│  └── src/
│      ├── main.tsx
│      ├── App.tsx
│      └── api/tasks.ts
└── backend/
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| QueryClientProvider | Query共有| QueryClient設定|
| TaskList | データ取得| `useQuery` |
| tasksApi | fetch列| `fetchTasks()` |
| Backend | API | `GET /tasks` |

## 3. API 詳細

### GET `/tasks`

Task配列を返す。
## 4. 詳細API I/O 定義

| Query項目| 値 |
|---|---|
| queryKey | `['tasks']` |
| queryFn | `fetchTasks` |
| data | `Task[]` |
| error | `Error` |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| QueryClientProvider | App全体をの |
| queryKey | 固定キー |
| API response | Task配列 |

## 6. エラー応答仕様
| error_code | 発生条件 | 表示 |
|---|---|---|
| `query_failed` | APIエラー | error UI |
| `provider_missing` | Provider未設定| Reactエラー |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| loading | `isLoading` |
| error | `isError` |
| refetch | 再取得ボタン |

## 8. データベース詳細

DBは必要にしないPI固定データでよい。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- Network と Query 状態を照合する
- キャッシュ挙動はREADMEに確認手順を書く
## 11. DDL

DBを使用しない各DDL はない
## 12. 実装メモ

- `staleTime` を設定する場合は README で意味を説明する
- `useMutation` は対象外
