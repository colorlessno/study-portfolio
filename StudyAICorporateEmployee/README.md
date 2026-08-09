# StudyAICorporateEmployee

人事、営業などの役割別AIアシスタントを題材に、役割定義、強制権限、エスカレーション、評価を分けて学ぶ文書・演習プロジェクトです。

- [AI社員 Claude実装ガイド](./AI社員_Claude実装ガイド.md)
- [役割境界の比較演習](./exercise/README.md)

## 15分で学習を再開する

Claude CodeやAPIへ接続せず、2つの役割定義、権限設定、8つの評価caseを検証できる。

```cmd
cd StudyAICorporateEmployee
python exercise\scripts\validate_profiles.py
python -m unittest discover -s exercise\scripts -p "test_*.py"
```

次に `exercise/cases.json` から1件選び、期待する `answer / clarify / escalate / refuse` を予想してから、各役割の `CLAUDE.md` と照合する。Claude Codeを利用できる場合だけ実応答の評価へ進む。

## 学習する境界

| 層 | 成果物 | 学ぶこと |
|----|--------|----------|
| 行動指示 | `CLAUDE.md` | 役割、担当範囲、禁止事項、応答形式 |
| 強制権限 | `.claude/settings.json` | toolのdeny、確認不能な操作の遮断 |
| 評価 | `cases.json`、比較表 | 正答らしさではなく、権限と引き継ぎ判断を採点する |

この教材は実在企業の業務を自律実行する「社員」ではなく、架空データを使った役割別AIアシスタントのprototypeを扱う。実データ、実送信、契約・人事判断は対象外とする。
