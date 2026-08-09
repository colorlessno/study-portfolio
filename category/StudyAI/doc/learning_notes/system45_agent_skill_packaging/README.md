# system45 agent skill の梱包

## 目的

AI agentが再利用できるskillを、指示、参照資料、script、入出力契約に分けて整理する方法を学ぶ。

## 学習順

1. `sample_skill/SKILL.md` を読み、skillの入口を確認する。
2. `docs/skill_contract.md` で入出力と禁止事項を確認する。
3. `docs/reference_split.md` で参照資料の分け方を確認する。
4. `sample_skill/scripts/validate_input.js` を実行し、入力検証の役割を確認する。
5. `docs/failure_patterns.md` と `docs/skill_vs_tool_calling.md` を読み、skillとtool callingの違いを整理する。

## 完了条件

- skill本文、参照資料、補助scriptの責務を分けられる。
- skillが受け取る入力と返す出力を説明できる。
- secretsや個人情報をskill sampleへ入れない。
