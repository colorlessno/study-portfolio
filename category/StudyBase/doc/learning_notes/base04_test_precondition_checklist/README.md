# base04 テスト成立条件チェック

テストを実行する前に、環境、データ、権限、手順、期待結果、判定者が揃っているか確認します。

## 到達目標

- テスト失敗と、テストを開始できない状態を区別できる。
- 前提不足を実行前に検出できる。
- 期待結果と合否判定を第三者が再現できる形で書ける。

## 教材

- [テスト前提ケース](../../../src/samples/base04_test_precondition_checklist/test_precondition_case.md) / [記入例](../../../src/samples/base04_test_precondition_checklist/completed_test_precondition_checklist.md)
- [チェックテンプレート](../../templates/base04_test_precondition_checklist/)
- [要件定義](../../requirements/base04_test_precondition_checklist_requirements.md) / [基本設計](../../basic_design/base04_basic_design.md) / [詳細設計](../../detailed_design/base04_detailed_design.md)

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base04
```

ケースから環境、データ、権限、期待結果の不足を1件ずつ探し、「未確認のまま実行すると何が分からなくなるか」を書きます。

## 完了条件

開始可否、停止条件、合否基準、証拠の保存先をチェックリストへ示せれば完了です。
