# base11 要件定義
## Portfolio demo presentation

## 1. 目的

学習成果物を就職活動や説明用ポートフォリオとして伝えるために、構成説明、デモ台本、証拠選定、短い動画構成を学ぶ。

## 2. 学習対象

- portfolio narrative
- demo script
- architecture explanation
- evidence selection
- before / after
- short video structure
- risk and limitation note

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 1つのStudy成果物を選び、説明対象を定義する |
| FR-02 | 60秒、3分、5分の説明台本を作る |
| FR-03 | 画面、API、DB、ログ、テスト結果の証拠を選ぶ |
| FR-04 | 苦労した点、設計判断、検証結果を整理する |
| FR-05 | 誇張しない制限事項と今後の改善を記録する |

## 4. 非機能要件

- 実績を過大表現しない。
- 実個人情報、秘密情報、顧客情報を含めない。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- 動画編集ソフトの本格操作
- 採用応募書類の代筆
- 実企業情報の公開

## 6. 成果物

```text
category/StudyBase/
  doc/requirements/base11_portfolio_demo_presentation_requirements.md
  doc/basic_design/base11_basic_design.md
  doc/detailed_design/base11_detailed_design.md
  doc/learning_notes/base11_portfolio_demo_presentation/
```

## 7. 受入条件

- Study成果物を短く説明できる。
- 証拠をもとに設計・製造・検証を説明できる。
- 制限事項を隠さず説明できる。
