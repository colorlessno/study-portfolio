# base02 情報不足時の暫定成果物

情報不足でも、書ける範囲、書けない範囲、仮定、未確定事項、利用上の限界を分けた暫定成果物を作ります。

## 到達目標

- 不明な内容を事実として断定しない。
- 仮定に根拠、影響、確認先を付けられる。
- 暫定成果物をどこまで利用できるか明示できる。

## 教材

- [情報不足ケース](../../../src/samples/base02_incomplete_information_deliverable/incomplete_case.md) / [記入例](../../../src/samples/base02_incomplete_information_deliverable/completed_provisional_deliverable.md)
- [テンプレート一式](../../templates/base02_incomplete_information_deliverable/)
- [要件定義](../../requirements/base02_incomplete_information_deliverable_requirements.md) / [基本設計](../../basic_design/base02_basic_design.md) / [詳細設計](../../detailed_design/base02_detailed_design.md)

## 始める前の問い

- 画面キャプチャからDB設計まで断定できるか。
- 仮定が外れた場合、どの成果物を直す必要があるか。
- 誰がいつ未確定事項を確認するか。

## 15分で再開

```powershell
node StudyBase\scripts\validate-studybase.mjs base02
```

ケースから書けること・書けないことを3件ずつ抽出し、最も影響が大きい仮定を1件テンプレートへ記入して、記入例と比較します。

## 完了条件

事実、仮定、未確認を分け、利用範囲と限界を読み手が誤解しない形で示せれば完了です。
