# web31 詳細設計
## Issue / PR 風 作業記録

---

## 1. 実装ディレクトリ構成

```text
doc/learning_notes/web31_issue_pr_style/ and doc/templates/web31_issue_pr_style/
├── issue-template.md
├── pr-template.md
├── examples/
│   ├── sample-issue.md
│   └── sample-pr.md
└── README.md
```

## 2. モジュール詳細

| ファイル | 役割 | 主な内容 |
|---|---|---|
| issue-template | 作業前整理 | 背景、目的、完了条件 |
| pr-template | 作業後説明 | 変更概要、理由、確認結果 |
| examples | 記入例 | sample issue/pr |
| README | 使い方 | 記入方針 |

## 3. API 詳細

HTTP API は使用しない。Markdownテンプレート項目をIFとして定義する。

## 4. 詳細API I/O 定義

### 4.1 Issue項目

| 項目 | 必須 |
|---|---|
| 背景 | ○ |
| 目的 | ○ |
| やること | ○ |
| 完了条件 | ○ |

### 4.2 PR項目

| 項目 | 必須 |
|---|---|
| 変更概要 | ○ |
| 変更理由 | ○ |
| 影響範囲 | ○ |
| 確認結果 | ○ |
| 未対応事項 |  |

## 5. 入力チェック仕様

| 対象 | ルール |
|---|---|
| チェックリスト | Markdown `- [ ]` |
| 確認結果 | 実施内容を書く |
| 影響範囲 | 不明なら不明と書く |

## 6. エラー応答仕様

| error_code | 発生条件 | 対応 |
|---|---|---|
| `missing_change_reason` | 変更理由なし | 追記 |
| `unchecked_result` | 確認結果なし | 追記 |

## 7. バリデーション一覧

| 対象 | 確認 |
|---|---|
| Issue | 背景/目的/完了条件 |
| PR | 変更概要/理由/確認結果 |
| examples | テンプレートに沿う |

## 8. データベース詳細

DBは使用しない。

## 9. AI 処理詳細

AI処理は使用しない。

## 10. エラー・監査設計

- 実施していない確認を確認済みと書かない
- 影響範囲を空欄にしない

## 11. DDL

DBを使用しないため DDL はない。

## 12. 実装メモ

- 実務向けに短く読みやすいテンプレートにする
- 就活用にも読める粒度で記入例を作る
