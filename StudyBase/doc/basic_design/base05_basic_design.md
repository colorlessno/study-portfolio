# base05 RACI / 責任分担表 基本設計
## 0. 関連要件

- `../requirements/base05_raci_responsibility_matrix_requirements.md`

## 1. 設計目的
作業や判断の責任範囲を、実施者、承認者、相談先、共有先に分けて整理する学習サンプルを設計する。
## 2. 対象範囲

- 作業項目の整理
- RACI の割り当て
- 判断待ち事項の整理
- エスカレーション事項の整理
- 役割定義メモの作成

## 3. 成果物構成

```text
doc/learning_notes/base05_raci_responsibility_matrix/
  README.md
doc/templates/base05_raci_responsibility_matrix/
  decision_pending_list.md
  escalation_note.md
  raci_matrix.md
src/samples/base05_raci_responsibility_matrix/
  responsibility_case.md
  completed_raci_matrix.md
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 作業一覧 | 要件定義、設計、実装、テスト、承認など |
| 関係者 | 依頼者、担当者、承認者、運用担当など |
| 判断事項 | 決定者が必要な事項 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| RACI表 | Responsible / Accountable / Consulted / Informed の一覧 |
| 判断待ち事項一覧 | 誰が決めるべきか未確定の事項 |
| エスカレーションメモ | 自分では決められない事項 |

## 6. 処理方針
1. 作業項目を洗い出す
2. 関係者を整理する
3. 各作業に RACI を割り当てる
4. 決定者不在の事項は判断待ちにする
5. エスカレーション内容をまとめる

## 7. 確認観点

- 実施者と承認者が混ざっていないか
- 自分で決めてよい範囲が明確か
- 判断待ち事項が放置されていないか

## 8. 後続工程への引き継ぎ

詳細設計では、RACI表の列、役割定義、判断待ち事項の状態管理を定義する。
