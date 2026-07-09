# base11 詳細設計
## Portfolio demo presentation

## 0. 関連文書

- `../requirements/base11_portfolio_demo_presentation_requirements.md`
- `../basic_design/base11_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/base11_portfolio_demo_presentation/
  README.md
  docs/
    target_selection.md
    demo_script_60s.md
    demo_script_3min.md
    demo_script_5min.md
    evidence_selection.md
    limitation_note.md
    video_structure.md
```

## 2. target selection 設計

| 項目 | 内容 |
|---|---|
| target Study | 説明対象のStudy成果物 |
| audience | 採用担当、技術面接、学習記録など |
| message | 何を伝えるか |
| evidence | 画面、API、DB、ログ、テスト、設計書 |
| limitation | 未実装、未検証、改善余地 |

## 3. 台本テンプレート

| 時間 | 構成 |
|---|---|
| 60秒 | 目的、作ったもの、見せる証拠1つ、学び |
| 3分 | 背景、構成、代表操作、検証結果、制限事項 |
| 5分 | 要件、設計判断、実装、検証、失敗と改善、残課題 |

## 4. evidence selection 設計

| evidence type | 例 | 採用基準 |
|---|---|---|
| screen | UI screenshot | 利用者価値が見える |
| API | curl response | 入出力が説明できる |
| DB | query result | 状態変化が説明できる |
| log | request id、error log | 運用観点が説明できる |
| test | test result、Playwright trace | 検証した事実が示せる |
| docs | requirements、design、review | 考えた過程が説明できる |

## 5. limitation note 設計

| 項目 | 内容 |
|---|---|
| not implemented | 未実装範囲 |
| not verified | 未検証範囲 |
| known issue | 既知の課題 |
| next improvement | 次に直すこと |
| wording rule | 誇張せず、事実と予定を分ける |

## 6. 確認手順

1. 説明対象のStudy成果物を1つ選ぶ
2. audienceとmessageを決める
3. evidenceを3つまで選ぶ
4. 60秒、3分、5分の台本を作る
5. limitation noteで誇張がないか確認する

## 7. 完了条件

- Study成果物を短く説明できる
- 証拠に基づいて設計・製造・検証を説明できる
- 制限事項を隠さず説明できる

## 8. 安全性

- 実個人情報、秘密情報、顧客情報を含めない
- 採用応募書類の代筆ではなく、説明構成の教材に限定する
- 実績を過大表現しない

