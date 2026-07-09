# web12 詳細設計## shadcn/ui風ダッシュボード
---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web12_shadcn_dashboard/
├── package.json
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  └── components/
│      ├── AppSidebar.tsx
│      ├── Header.tsx
│      ├── StatCard.tsx
│      └── DataTable.tsx
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主なprops |
|---|---|---|
| AppSidebar | ナビゲーション | `items` |
| Header | タイトル領域 | `title` |
| StatCard | 持つカーテ| `label`, `value`, `note` |
| DataTable | 一覧テーブル | `rows` |
| App | 全体成 | 固定データ |

## 3. API 詳細

HTTP API は使用しない固定データをUIコンポーネントへ渡す。
## 4. 詳細API I/O 定義

| 型| フィールド|
|---|---|
| MenuItem | `label`, `active`, `icon?` |
| Stat | `label`, `value`, `note` |
| TableRow | `id`, `name`, `status`, `updatedAt` |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| Stat.value | 表示可能な文列 |
| TableRow.id | 一意|
| status | 許可値のみ |
| responsive | モバイル幅読める |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `table_overflow` | テーブルがあるみ出い| scrollまたは列調整 |
| `invalid_status` | 想定外status | TypeScript型で制限|

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| props | TypeScript型|
| rows | `id` るkey にする |
| layout | サイドバー/メインの崩れを確認|

## 8. データベース詳細

DBは使用しない固定ダッシュボードデータを扱い
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- Console警告と画面崩れを確認する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- 管理画面なので情報密度を優先する
- 大きなヒーローや装飾過多を避ける
- lucide-react を使い合わせアイコン用途を限定する
