# web25 詳細設計## Next.js フォーム送信

---

## 1. 実装ディレクトリ構成

```text
src/frontend/src/studyweb/systems/web25_next_form_action/
├── package.json
├── app/
│  ├── page.tsx
│  └── actions.ts
└── README.md
```

## 2. モジュール詳細

| モジュール | 役割 | 主な処理|
|---|---|---|
| page.tsx | フォーム表示 | form, input |
| actions.ts | Server Actions | 入力取得、検証、結果返却 |
| README | 比較明| NestJS列成との差 |

## 3. API 詳細

HTTP API エンドのインの直接定義しないext.js Server Actions によるフォーム送信処理詳細IFとして扱い
## 4. 詳細API I/O 定義

| 入力項目| 型| 必須|
|---|---|---|
| title | string | ○|
| description | string |  |

| 出力| 内容|
|---|---|
| success | 成功メテージ |
| error | エラーメテージ |

## 5. 入力チェック仕様
| 対象 | ルール | 不正時|
|---|---|---|
| title | 空不可 | エラー |
| description | 任意| そまま処理|

## 6. エラー応答仕様
| error_code | 発生条件 | 表示 |
|---|---|---|
| `validation_failed` | title空 | エラー表示 |
| `action_failed` | 処理外| エラー表示 |

## 7. バリデーション一覧

| 対象 | 実装|
|---|---|
| title | trim後空文字チェック|
| FormData | 型変換 |

## 8. データベース詳細

DB保存の必要にしない力値は処理に永続化しない
## 9. AI 処理詳細

AI処理は使用しない
## 10. エラー・監査設計
- サーバー側検証を必要行う
- 監査ログは扱わない
## 11. DDL

DBを使用しないるDDL はない
## 12. 実装メモ

- `actions.ts` に Server Action を定義する
- Server Action には `"use server"` を付ける
- README に React + NestJS 構成との違いを記載する
