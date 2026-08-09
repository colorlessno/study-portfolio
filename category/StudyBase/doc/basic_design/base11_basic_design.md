# base11 基本設計
## Portfolio demo presentation

## 0. 関連要件

- `../requirements/base11_portfolio_demo_presentation_requirements.md`

## 1. 設計目的

Study成果物を、証拠に基づいて短く説明するためのポートフォリオ構成、デモ台本、証拠選定、制限事項メモを設計する。

## 2. 対象範囲

- portfolio narrative
- demo script
- architecture explanation
- evidence selection
- before / after
- short video structure
- risk and limitation note

## 3. 成果物構成

```text
category/StudyBase/
  doc/learning_notes/base11_portfolio_demo_presentation/
    README.md
    docs/
      target_selection.md
      demo_script_60s.md
      demo_script_3min.md
      demo_script_5min.md
      evidence_selection.md
      limitation_note.md
```

## 4. 入力

| 入力 | 内容 |
|---|---|
| Study成果物 | 説明対象にする1つのテーマ |
| 証拠候補 | 画面、API、DB、ログ、テスト結果、設計書 |
| 説明時間 | 60秒、3分、5分 |
| 制限事項 | 未実装、未検証、今後の改善 |

## 5. 出力

| 出力 | 内容 |
|---|---|
| 説明対象定義 | 何を作り、何を学んだか |
| demo script | 時間別の説明台本 |
| evidence list | 見せる証拠と採用理由 |
| limitation note | 誇張しない制限事項と改善案 |

## 6. 処理方針

1. 説明対象のStudy成果物を選ぶ
2. 見せる証拠を設計、実装、検証から選ぶ
3. 60秒、3分、5分の台本を作る
4. 苦労した点、設計判断、検証結果を整理する
5. 制限事項と今後の改善を隠さず記録する

## 7. 確認観点

- Study成果物を短く説明できるか
- 証拠に基づいて設計・製造・検証を説明できるか
- 実績を過大表現せず、制限事項を説明できるか

## 8. 後続工程への引き継ぎ

詳細設計では、台本テンプレート、証拠選定表、動画構成メモ、制限事項フォーマットを定義する。

