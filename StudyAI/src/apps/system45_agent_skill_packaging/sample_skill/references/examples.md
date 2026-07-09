# examples 入出力例

## 入力例

```json
{
  "task_goal": "Markdown checklistをreviewし、足りない検証stepを見つける。",
  "target_file": "docs/checklist.md",
  "expected_output": "指摘を先に書き、その後に短いsummaryを書く。"
}
```

## 出力例

```text
指摘:
1. checklistに検証commandがないため、完了したか確認できません。

要約:
決定的に確認できるcheckを1つ追加し、最終noteに結果を記録してください。
```

sample textも日本語で管理する。field名は検証scriptに合わせて `task_goal`、`target_file`、`expected_output` を使う。
