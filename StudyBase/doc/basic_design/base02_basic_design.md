# base02 情報不足時の暫定成果物 基本設計
## 0. 関連要件

- `../requirements/base02_incomplete_information_deliverable_requirements.md`

## 1. 設計目的
情報不足の状態で、完成版ではなく前提付きの暫定成果物を作る学習サンプルを設計する。
## 2. 対象範囲

- 情報不足ケースの整理
- 書ける範囲と書けない範囲の分類
- 前提、仮定、未確定事項の記録
- 成果物限界メモの作成

## 3. 成果物構成

```text
doc/learning_notes/base02_incomplete_information_deliverable/
  README.md
doc/templates/base02_incomplete_information_deliverable/
  assumption_list.md
  deliverable_limitation_note.md
  provisional_deliverable.md
  unknown_issues_list.md
src/samples/base02_incomplete_information_deliverable/
  incomplete_case.md
  completed_provisional_deliverable.md
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 依頼内容 | 情報が不足した作業依頼 |
| 入手済み資料 | 仕様断片、会話メモ、既存画面、ログなど |
| 不明点 | 確認できていない事項 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| 暫定成果物 | 書ける範囲だけで作った成果物 |
| 前提・仮定一覧 | 暫定判断の根拠 |
| 未確定事項一覧 | 確認先、確認内容、期限 |
| 成果物限界メモ | 使ってよい範囲、レビュー観点 |

## 6. 処理方針
1. 入手済み情報を情報源ごとに整理する
2. 書ける範囲と書けない範囲を分ける
3. 仮定で補った箇所を明示する
4. 未確定事項へ確認先を付ける
5. 成果物の限界を添えて暫定版として出す
## 7. 確認観点

- 不明点を断定していないか
- 暫定成果物としての限界が明記されているか
- 後続レビューで確認すべき観点が残っているか
## 8. 後続工程への引き継ぎ

詳細設計では、テンプレート項目、情報源管理、未確定事項の状態管理を定義する。
