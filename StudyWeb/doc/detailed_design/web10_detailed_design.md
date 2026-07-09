# web10 詳細設計## TypeScript型つきデータモデル

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web10_typescript_model/
├── package.json
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  ├── models/
│  │  ├── user.ts
│  │  ├── task.ts
│  │  └── article.ts
│  └── data/
│      └── sampleData.ts
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な定義 |
|---|---|---|
| `user.ts` | User型| `User`, `UserRole` |
| `task.ts` | Task型| `Task`, `TaskStatus` |
| `article.ts` | Article型| `Article` |
| `sampleData.ts` | 型付きサンプル | `users`, `tasks`, `articles` |
| `App.tsx` | 表示 | 型付きprops |

## 3. API 詳細

HTTP API は使用しない型定義を詳細IFとして扱い
## 4. 詳細API I/O 定義

| 型| フィールド|
|---|---|
| User | `id`, `name`, `email`, `role` |
| Task | `id`, `title`, `status`, `assigneeId?` |
| Article | `id`, `title`, `summary`, `published` |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| `User.email` | string |
| `Task.status` | union型|
| `Article.published` | boolean |
| sample data | 各に代入可能 |

## 6. エラー応答仕様
| error_code | 発生条件 | 検出 |
|---|---|---|
| `type_mismatch` | 型不一致 | TypeScript compile |
| `missing_required_field` | 必要項目不足 | TypeScript compile |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| 必須任意| `?` で表現 |
| 状態値 | union型|
| 配列 | `Type[]` |

## 8. データベース詳細

DBは使用しない型は画面内ータモデルとして扱い
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- 型エラーはエテタまたは `npm run build` で検出する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `any` は使わない
- 型定義と表示コンポーネントを分ける
- README に「型に合わないデータを入れた場合」の確認方法を書く
