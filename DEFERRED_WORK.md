# 保留課題一覧

現在の改善範囲では直さないが、周囲の文書・実装・テーマ分類との意味や関連性がずれる可能性がある事項を記録します。後続作業はこの一覧を確認してから対象範囲を決めます。

## 記録ルール

1. 要件、設計、実装、学習ノート、カタログの説明が一致しない場合は、現在作業へ無理に混ぜず記録する。
2. 名前、分類、正規の学習経路、他テーマとの責務が曖昧な場合も記録する。
3. 修正時は対象範囲と依存先を確認し、statusを`対応中`へ変更する。
4. PRをmainへ統合した後、結果とcommitまたはPR番号を記録して`完了`へ変更する。

## 未対応

| ID | 対象 | ズレ・影響 | 後続作業 | status |
|---|---|---|---|---|
| STAI-001 | StudyAI system24 | `selected_model`が比較指標ではなく配列先頭で決まり、model選定という意味と一致しない | must条件と評価式を設計し、選定理由を出力する | 未対応 |
| STAI-002 | StudyAI system25 | temperatureがmock outputへ影響せず、既定dataでは途中切れも発生しない | 変化とcutoffを観察できるcaseを追加する | 未対応 |
| STAI-003 | StudyAI system27 | `expected_points`を採点に使わず、width由来の合成値だけをaccuracyとしている | ground truth照合と入力条件別の評価へ分離する | 未対応 |
| STAI-004 | StudyAI system28 | 入力`rules`を選択適用せず、全角数字とreview flagも未処理 | rule単位の適用、差分、要review判定を実装する | 未対応 |
| STAI-005 | StudyAI system30 | 文字重なりにより既定3文書がすべて重複候補になり、scoreや採用判断も出力しない | exact・near duplicateを分け、threshold評価とreview結果を追加する | 未対応 |
| STAI-DOC-001 | StudyAI requirements index | 48テーマに対して一覧がsystem01〜16中心で、一部に意味の崩れた表記が残る | 48テーマの正規索引へ更新し、文意を確認して修正する | 未対応 |
| STAI-DOC-002 | StudyAI system47・48 | 学習ノートにUTF-8としては正しいが文意が崩れた日本語が残る | 要件・実装と照合し、学習手順を再構成する | 未対応 |
| CATALOG-001 | 全体テーマカタログ | 現在は主にID、題名、linkで、概要・前提・難易度・所要時間・実行方法・完成度を横断比較できない | StudyHub Phase 1のmetadata catalogとして定義・生成する | 未対応 |
| ARCH-001 | system15とbook_summarization_cli | 電子書籍要約の既存テーマと、将来のKnowledge Library統合機能の責務が重複する可能性がある | 統合前に正規機能、教材、移行元の境界を決める | 未対応 |

## 完了

完了した項目は削除せず、対応PRと結果を残します。

| ID | 結果 | PR・commit |
|---|---|---|
