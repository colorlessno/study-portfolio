# base05 RACI / 責任分界

作業と判断を、実施者、最終承認者、相談先、共有先へ分け、責任の空白や重複を見つけます。

## 到達目標

- ResponsibleとAccountableを区別できる。
- 未決定事項の判断者と期限を示せる。
- 技術問題と業務判断のエスカレーション先を分けられる。

## 教材

- [責任分界ケース](../../../src/samples/base05_raci_responsibility_matrix/responsibility_case.md) / [記入例](../../../src/samples/base05_raci_responsibility_matrix/completed_raci_matrix.md)
- [RACI](../../templates/base05_raci_responsibility_matrix/raci_matrix.md) / [未決定事項](../../templates/base05_raci_responsibility_matrix/decision_pending_list.md) / [エスカレーション](../../templates/base05_raci_responsibility_matrix/escalation_note.md)
- [要件定義](../../requirements/base05_raci_responsibility_matrix_requirements.md) / [基本設計](../../basic_design/base05_basic_design.md) / [詳細設計](../../detailed_design/base05_detailed_design.md)

## 15分で再開

```powershell
node StudyBase\scripts\validate-studybase.mjs base05
```

ケースから作業を3つ選び、各作業のRとAを決めます。Aが複数または不在になった行を見つけ、決定方法を書きます。

## 完了条件

重要な判断ごとにAが1人あり、相談・共有と承認を混同しない表を作れれば完了です。
