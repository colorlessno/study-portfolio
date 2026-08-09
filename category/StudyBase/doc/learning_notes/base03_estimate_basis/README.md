# base03 見積もり根拠

数字を先に決めず、対象範囲、除外範囲、前提、作業分解、依存、リスクから見積りを説明します。

## 到達目標

- 作業を確認可能な単位へ分解できる。
- 見積りへ含むものと含まないものを明示できる。
- 不確実性をリスクと確認課題として扱える。

## 教材

- [見積りケース](../../../src/samples/base03_estimate_basis/estimate_case.md) / [記入例](../../../src/samples/base03_estimate_basis/completed_estimate_basis.md)
- [作業分解](../../templates/base03_estimate_basis/work_breakdown.md) / [見積り根拠](../../templates/base03_estimate_basis/estimate_basis.md) / [リスク](../../templates/base03_estimate_basis/risk_list.md)
- [要件定義](../../requirements/base03_estimate_basis_requirements.md) / [基本設計](../../basic_design/base03_basic_design.md) / [詳細設計](../../detailed_design/base03_detailed_design.md)

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base03
```

ケースを「確認、設計、実装、検証、引渡し」へ分け、最も不確実な作業と見積り幅が変わる条件を書きます。その後に記入例と比較します。

## 説明課題と完了条件

「3日です」とだけ答える場合と、前提・除外・リスクを添える場合の違いを説明します。数字が変わる条件と再見積りの時点を示せれば完了です。
