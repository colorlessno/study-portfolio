# base07 branch / merge / conflict

2つのbranchで同じ行を変更し、競合の発生、内容確認、意図を統合した解消までを一時Gitリポジトリで練習します。

## 到達目標

- branchがcommitを指す名前であることを説明できる。
- conflict markerのoursとtheirsを機械的に選ばず読める。
- 解消後にテストと履歴確認が必要な理由を説明できる。

## 教材

- [練習原本](../../../src/samples/base07_branch_merge_conflict/practice_repo/)
- [操作記録](notes/branch_operation_log.md) / [競合再現](notes/conflict_reproduction.md) / [解消記録](notes/conflict_resolution_note.md)
- [要件定義](../../requirements/base07_branch_merge_conflict_requirements.md) / [基本設計](../../basic_design/base07_basic_design.md) / [詳細設計](../../detailed_design/base07_detailed_design.md)

## 15分で安全に再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base07
```

検証器は一時コピーでmainとfeature/aを作り、同じ行の変更、merge失敗、conflict marker確認、統合した解消、cleanなstatusまで確認して削除します。

## 説明課題と完了条件

どちらか一方を残すだけでは不十分な競合例を書き、両方の意図をどう統合するか説明します。解消理由と再確認結果を記録できれば完了です。
