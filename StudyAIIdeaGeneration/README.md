# StudyAIIdeaGeneration

AI を使ったアイデア出し（発想支援）ワークフローを設計・検証するための個人学習用プロジェクトです。入力、発想法、出力構造、評価方法を分けて観察します。

## 15分で学習を再開する

最初はLM Studioへ接続せず、入力JSONと5つのpromptの構造を検証する。

```cmd
cd StudyAIIdeaGeneration
python verify\verify_prompts.py --check-only
python -m unittest discover -s verify -p "test_*.py"
```

次に[`exercise/README.md`](exercise/README.md)を開き、基準入力と制約変更後の入力で結果がどう変わるか予想する。LM Studioを利用できる場合だけ実際の生成比較へ進む。

## 学習経路

| 段階 | AI接続 | 確認すること |
|------|--------|--------------|
| 構造確認 | 不要 | 入力項目、placeholder、promptの必須section、validator |
| 2入力比較 | LM Studio | 制約変更が発想内容と上位案へ与える影響 |
| 全工程検証 | LM Studio | 5手法の連結、JSON妥当性、件数、所要時間、token数 |

## 構成

```text
StudyAIIdeaGeneration/
  doc/        ワークフローアプリの設計まとめ
  prompts/    発想法プロンプト（mindmap / persona / scamper / six_hats / reverse_plan 等）
  exercise/   基準入力・変更入力・比較表を使う反復演習
  verify/     プロンプト検証用スクリプトと入力例
```

## 内容

- AI アイデア出しワークフローの設計（`doc/ai_ideation_workflow_app_design_v2.md` ほか）
- 複数の発想フレームワーク（マインドマップ、ペルソナ、SCAMPER、シックスハット 等）のプロンプト
- プロンプトの挙動を確認する検証スクリプト
- API接続なしで再実行できる構造検証と単体テスト

## 本リポジトリについて

- 個人の学習用に作成している実験的なプロジェクトです。
- 開発・整理には Claude Code / Codex などの AI コーディングアシストを活用しています。
- 学習目的のため、各テーマの粒度や完成度には差があります。
