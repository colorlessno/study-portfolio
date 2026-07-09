# security21 AIコンテンツ判定

## 目的

不要なsensitive textを保存・再掲しない moderation decision flow を学ぶ。

この単元では抽象ケースだけを扱う。詳細な不適切本文ではなく、category、context、decision、reason、audit項目を記録する。

## 学習順

1. `docs/content_safety_taxonomy.md` を読む。
2. `docs/moderation_case_table.md` の短い抽象ケースを分類する。
3. `docs/audit_log_schema.md` で保存すべき項目を確認する。
4. `docs/safe_response_examples.md` で安全な応答例を比較する。
5. `docs/escalation_notes.md` でescalation条件を確認する。

## 完了条件

- moderation decision を説明できる。
- 保存する証拠が最小限である。
- responseで不適切内容やsensitive textを繰り返さない。
- escalation条件が明確である。
