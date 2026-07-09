# web07 詳細設計## Reactカウンター

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web07_react_counter/
├── package.json
├── index.html
├── src/
│  ├── main.tsx
│  ├── App.tsx
│  └── App.css
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数/要素 |
|---|---|---|
| `main.tsx` | Reactマウンテ| `createRoot()` |
| `App.tsx` | カウンター本体| `useState`, `increment`, `decrement`, `reset` |
| `App.css` | 画面スタイル | カウント表示、ボタン |

## 3. API 詳細

HTTP API は使用しないReactイベントをIFとして扱い
| イベント| 発生元 | 処理|
|---|---|---|
| `click.increment` | 加算ボタン | `setCount(count + 1)` |
| `click.decrement` | 減算ボタン | `setCount(count - 1)` |
| `click.reset` | リセットボタン | `setCount(0)` |

## 4. 詳細API I/O 定義

| 状態| 型| 初期値 | 用途|
|---|---|---|---|
| `count` | number | 0 | 現在カウンテ|

| 出力項目| 内容|
|---|---|
| カウント表示 | `count` の現在値 |
| ボタン | 加算減算リセット|

## 5. 入力チェック仕様
| 対象 | チェック項目| ルール |
|---|---|---|
| `count` | 型| number |
| イベント| 操作| button click のみ |

## 6. エラー応答仕様
| error_code | 発生条件 | 対処|
|---|---|---|
| `dev_server_not_started` | Vite未起動| `npm run dev` |
| `dependency_missing` | node_modulesない| `npm install` |

## 7. バリデーション一覧

| 対象 | ルール |
|---|---|
| state更新 | `setCount` を使い|
| 表示 | state値を直接表示する |
| リセット| 常に0に戻い|

## 8. データベース詳細

DBは使用しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- ブラウザ Console にエラーがあるかないかを確認する
- Vite のターミナルログを起動確認に使う
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

```tsx
const [count, setCount] = useState(0);
```

- state変更によって再描画されることも README に説明する
- props や状態管理ライブラリは使わない
