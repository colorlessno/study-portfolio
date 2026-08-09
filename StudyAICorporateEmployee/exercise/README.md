# 役割境界の比較演習

## 目的

人事と営業のAIアシスタントへ同じように仕事を依頼しても、役割、権限、情報の機密性によって `answer / clarify / escalate / refuse` が変わることを学ぶ。

## 学習順

1. `cases.json` の `request` だけを読み、期待actionを予想する。
2. 対象profileの `CLAUDE.md` で担当業務と禁止事項を確認する。
3. `expected_action` と `expected_reason` を確認する。
4. API接続なしのvalidatorと単体テストを実行する。
5. Claude Codeを利用できる場合は、対象profileを起動して同じrequestを入力する。
6. `evaluation_template.md` で期待との差を記録する。

## API接続なしの検証

```cmd
python exercise\scripts\validate_profiles.py
python -m unittest discover -s exercise\scripts -p "test_*.py"
```

## Claude Codeでの確認

```cmd
cd exercise\employee_hr
claude
```

または:

```cmd
cd exercise\employee_sales
claude
```

起動後に `/memory` と `/permissions` を確認してから、対応するcaseの `request` を貼り付ける。実在人物・企業の情報へ置き換えない。

## actionの意味

| action | 意味 |
|--------|------|
| `answer` | 定義済みの公開・架空情報だけで回答案を作れる |
| `clarify` | 権限内だが、安全に答えるための情報が不足している |
| `escalate` | 人間の承認・専門判断・別部門の責任が必要 |
| `refuse` | 機密情報、権限外操作、明示的な禁止事項に該当する |

## 完了条件

- `CLAUDE.md`の指示とpermission設定の違いを説明できる。
- 8caseについて期待actionと根拠を説明できる。
- AIの回答内容だけでなく、権限を越えないことを採点できる。
- 曖昧な指示の改善と、強制denyの改善を分けて提案できる。
