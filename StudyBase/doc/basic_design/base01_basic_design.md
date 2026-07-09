# base01 曖昧依頼ヒアリング 基本設計
## 0. 関連要件

- `../requirements/base01_ambiguous_request_hearing_requirements.md`

## 1. 設計目的
曖昧な依頼を、要件定義へ渡せる入力情報へ整理する学習サンプルを設計する。
## 2. 対象範囲

- 曖昧依頼のサンプル提示
- ヒアリング観点の整理
- 確定情報、仮定、未確定事項の分類
- 要件定義へ渡す要約メモの作成

## 3. 成果物構成

```text
doc/learning_notes/base01_ambiguous_request_hearing/
  README.md
doc/templates/base01_ambiguous_request_hearing/
  request_hearing_note.md
  requirement_input_summary.md
src/samples/base01_ambiguous_request_hearing/
  ambiguous_request_case.md
  completed_hearing_note.md
```
## 4. 入力
| 入力 | 内容 |
|---|---|
| 曖昧依頼文 | 改善や売上向上、取りこぼし削減などの抽象的な依頼 |
| 既知情報 | 現時点で分かっている背景や制約 |
| 確認可能な相手 | 依頼者、業務担当、運用担当など |

## 5. 出力
| 出力 | 内容 |
|---|---|
| ヒアリングメモ | 目的、現状、課題、制約、成功条件を整理したもの |
| 未確定事項一覧 | 確認が必要な事項 |
| 要件定義入力メモ | 次工程へ渡す整理済み情報 |

## 6. 処理方針
1. 依頼文をそのまま記録する
2. 目的、現状、課題、制約、関係者、成功条件へ分類する
3. 確定情報、仮定、未確定事項へ分類する
4. 確認事項へ確認先と期限を付ける
5. 要件定義へ渡せる形で要約する
## 7. 確認観点

- 依頼文を勝手に仕様へ変換していないか
- 未確定事項が断定表現になっていないか
- 要件定義へ進める入力になっているか
## 8. 後続工程への引き継ぎ

詳細設計では、各テンプレートの項目、サンプルケース、記入例、レビュー観点を定義する。
