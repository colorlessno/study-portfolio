# base11 ポートフォリオdemo発表

学習プロジェクトを大きく見せるのではなく、利用者の結果、技術的な判断、検証証拠、現在の制限を短いstoryで説明します。

## 到達目標

- 見せる対象を1つの利用者行動へ絞れる。
- 主張をfile、command、test、screenshot、logで裏付けられる。
- 実装済み、検証済み、未確認、今後の計画を分けられる。

## 教材

1. [対象選定](docs/target_selection.md)
2. [証拠選定](docs/evidence_selection.md)
3. [60秒台本](docs/demo_script_60s.md)
4. [3分台本](docs/demo_script_3min.md)
5. [5分台本](docs/demo_script_5min.md)
6. [制限](docs/limitation_note.md)
7. [動画構成](docs/video_structure.md)

[要件定義](../../requirements/base11_portfolio_demo_presentation_requirements.md)、[基本設計](../../basic_design/base11_basic_design.md)、[詳細設計](../../detailed_design/base11_detailed_design.md)も参照します。

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base11
```

既に改善済みのStudyDBまたはStudyAWSから1テーマを選び、利用者の結果、技術判断、検証コマンド、制限を各1行で60秒台本へ記入します。

## 完了条件

60秒で「何を作り、何を確認し、何をまだ確認していないか」を証拠付きで説明できれば完了です。3分・5分版は必要に応じて詳細を追加します。
