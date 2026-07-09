# web08 詳細設計## Reactコンポーネントカタログ

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web08_component_catalog/
├── package.json
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  └── components/
│      ├── Button.tsx
│      ├── Card.tsx
│      ├── List.tsx
│      └── Modal.tsx
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主なprops |
|---|---|---|
| Button | ボタン共通部品| `variant`, `disabled`, `onClick`, `children` |
| Card | カード部品| `title`, `description`, `children` |
| List | 配列表示 | `items` |
| Modal | ダイアログ | `open`, `title`, `onClose`, `children` |
| App | 表示サンプル統各| 固定データ、Modal state |

## 3. API 詳細

HTTP API は使用しないコンポーネントropsをIFとして扱い
## 4. 詳細API I/O 定義

### 4.1 Button

| props | 型| 必須| 説明|
|---|---|---|---|
| `variant` | `'default' \| 'primary'` |  | 見た目 |
| `disabled` | boolean |  | 無効状態|
| `onClick` | function |  | クリック処理|
| `children` | ReactNode | ○| 表示内容|

### 4.2 Card

| props | 型| 必須| 説明|
|---|---|---|---|
| `title` | string | ○| カードのい|
| `description` | string | ○| カード本文|
| `children` | ReactNode |  | 補足表示る作ボタン |

### 4.3 List

| props | 型| 必須| 説明|
|---|---|---|---|
| `items` | `{ id: string; label: string }[]` | ○| 一覧表示対象 |
| `emptyMessage` | string |  | 空配列時の表示 |

### 4.4 Modal

| props | 型| 必須| 説明|
|---|---|---|---|
| `open` | boolean | ○| 表示状態|
| `title` | string | ○| タイトル |
| `onClose` | function | ○| 閉じる理|
| `children` | ReactNode | ○| 本文|

## 5. 入力チェック仕様
| 対象 | チェック項目| ルール |
|---|---|---|
| List | 空配列 | 空表示を出し|
| Modal | close導線| 閉じるボタン必須|
| Button | disabled | 無効時の操作不可 |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `invalid_props` | props型不一致 | TypeScriptで検出 |
| `modal_close_missing` | 閉じる操作ない| 実装ビューで修正 |

## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| props | TypeScript型を定義 |
| List | `items.length === 0` を者の |
| Modal | `open=false` で非表示 |

## 8. データベース詳細

DBは使用しない固定の列を画面表示に使い
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- TypeScriptの型エラーを設計の検出手段とする
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `components/` 配下にUI部品を分ける
- `children` を使う部品を最低1つ含める
- 外部UIライブラリは使わない
