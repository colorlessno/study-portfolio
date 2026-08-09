# web11 詳細設計## TailwindカードUI

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web11_tailwind_cards/
├── package.json
├── index.html
├── tailwind.config.*
├── postcss.config.*
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  └── index.css
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| App | カード一覧 | 配列をmapで表示 |
| index.css | Tailwind読込 | `@tailwind` directives |
| tailwind config | 対象ファイル持つ| content設定|

## 3. API 詳細

HTTP API は使用しないカードデータとTailwindクラスをIFとして扱い
## 4. 詳細API I/O 定義

| データ | 型| 用途|
|---|---|---|
| CardItem | `{ title: string; description: string; tag: string }` | カード表示 |

| Tailwindの| 使用例|
|---|---|
| layout | `grid`, `gap-*`, `max-w-*` |
| color | `bg-*`, `text-*`, `border-*` |
| responsive | `sm:*`, `md:*`, `lg:*` |
| state | `hover:*`, `focus:*` |

## 5. 入力チェック仕様
| 対象 | ルール |
|---|---|
| CardItem.title | 空文字不可 |
| CardItem.description | 長すぎる場合も折り返す |
| Tailwind設定| `src/**/*.{ts,tsx}` るcontent に含める |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `tailwind_not_applied` | 設定読込不備 | config と index.css 確認|
| `layout_overflow` | 横スクロール | class調整 |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| レスポンシテ| `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| hover | `hover:*` |
| focus | `focus:*` またはボタン標準挙動|

## 8. データベース詳細

DBは使用しないカードの固定の列。
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- ブラウザ表示とビルドログで確認する
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- Tailwind導入後、`index.css` る`main.tsx` で import する
- クラスが長い合わせ小さなコンポーネントへ列る
