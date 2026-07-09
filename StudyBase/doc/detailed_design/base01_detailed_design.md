# base01 曖昧依頼ヒアリング 詳細設計
## 0. 関連文書

- `../requirements/base01_ambiguous_request_hearing_requirements.md`
- `../basic_design/base01_basic_design.md`

## 1. 製造対象

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
## 2. テンプレート設計
### `request_hearing_note.md`

| 項目 | 内容 |
|---|---|
| 依頼原文 | 相手の依頼を加工せず記録 |
| 背景 | 分かっている背景 |
| 目的 | 何を達成したいか |
| 現状 | 現在の業務やシステム状態 |
| 課題 | 困りごと、発生している問題 |
| 制約 | 期限、予算、体制、環境 |
| 関係者 | 依頼者、利用者、運用者、承認者 |
| 成功条件 | 何をもって改善とするか |
| 未確定事項 | 確認が必要なこと |
| 次アクション | 誰に何を確認するか |

### `requirement_input_summary.md`

| 項目 | 内容 |
|---|---|
| 要約 | 要件定義へ渡す短い説明 |
| 確定情報 | 根拠がある情報 |
| 仮定 | 暫定的に置いた条件 |
| 未確定事項 | 合意前の事項 |
| 推奨する次工程 | 要件定義、追加ヒアリングなど |

## 3. サンプル設計
`ambiguous_request_case.md` は「営業案件の取りこぼしをなくしたい」という依頼を扱う。システム化、運用改善、営業ルール変更のどれかを決め打ちしない例にする。
`completed_hearing_note.md` は、依頼を目的、現状、課題、制約、成功条件へ分類した記入例にする。
## 4. 確認手順
1. 依頼原文が加工されず残っていることを確認する
2. 確定情報、仮定、未確定事項が分類されていることを確認する
3. 成功条件が測定可能な表現になっていることを確認する
4. 要件定義へ渡す要約が作成されていることを確認する
## 5. 完了条件

- テンプレート2本とサンプル2本がある
- 未確定事項に確認先と次アクションがある
- 依頼文から実装へ飛ばない例になっている
