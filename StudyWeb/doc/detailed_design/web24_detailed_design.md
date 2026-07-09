# web24 詳細設計## Next.js サーバー側データ取得
---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web24_next_server_fetch/
├── package.json
├── app/
│  ├── page.tsx
│  └── tasks/
│      └── page.tsx
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| tasks/page.tsx | サーバー側取得| async component |
| data source | データ提例| 固定JSON/API |
| README | 比較明| client fetchとの差 |

## 3. API 詳細

外部またはローカルデータ取得を行う。サンプル内容PIは必要にしない
## 4. 詳細API I/O 定義

| データ項目| 型|
|---|---|
| id | string |
| title | string |
| status | string |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| fetch結果 | 配列または表示可能データ |
| status | 許可値 |

## 6. エラー応答仕様
| error_code | 発生条件 | 表示 |
|---|---|---|
| `server_fetch_failed` | 取得失敗| エラー表示 |
| `invalid_data` | 形式不正 | エラー表示 |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| fetch | server component内容|
| error | try/catchまたはfallback |
| empty | 空表示 |

## 8. データベース詳細

DBは使用しない固定JSONまたはAPIレスポンスを扱い
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- サーバー側ログとブラウザNetworkの違いをREADMEに書く
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `async function Page()` で取得する
- Client Component の `useEffect` fetch との違いを付記する
