# system46 AI harness 設計

## 目的

AIが安定して作業できるように、入力fixture、決定的check、権限境界、実行logを揃える方法を学ぶ。

## ファイル

| path | 目的 |
| --- | --- |
| `fixtures/` | 成功、入力不足、禁止操作などのtask例 |
| `checks/check_output_schema.js` | 出力形式の簡易check |
| `checks/check_no_forbidden_ops.js` | 禁止操作の簡易check |
| `samples/expected_output.md` | 期待出力例 |

## 実行例

```cmd
node checks\check_output_schema.js samples\expected_output.md
node checks\check_no_forbidden_ops.js fixtures\task_success.json
```

AIそのものを呼ばなくても、harnessの契約と検証観点を学べる構成にしている。
