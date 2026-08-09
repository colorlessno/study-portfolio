# system45 基本設計

## Agent skill packaging

## 0. 関連要件

- `../requirements/system45_agent_skill_packaging_requirements.md`

## 1. 設計目的

AIエージェントが再利用できる skill を、目的・入力・出力・制約・参照情報・補助スクリプト・失敗パターンに分けて設計できる教材にする。

## 2. 対象領域

- skill metadata
- instruction file
- references
- scripts / tools
- progressive disclosure
- input / output contract
- failure pattern

## 3. 成果物構造

```text
category/StudyAI/
  doc/learning_notes/system45_agent_skill_packaging/
    README.md
    docs/
      skill_contract.md
      reference_split.md
      failure_patterns.md
    sample_skill/
      SKILL.md
      references/
      src/scripts/
```

## 4. 入力

| 入力 | 内容 |
|---|---|
| skill目的 | 何を補助する skill か |
| 利用条件 | いつ読み込むか、いつ使わないか |
| 参照情報 | 長い説明、仕様、チェックリスト |
| script候補 | 決定的に処理できる小さい処理 |

## 5. 出力

| 出力 | 内容 |
|---|---|
| skill contract | 入力・出力・制約・失敗条件 |
| sample skill | `SKILL.md`、references、scripts の最小構造 |
| 失敗パターン表 | 入力不足、権限不足、危険操作時の対応 |

## 6. 処理方針

1. skillの目的と対象外を決める
2. instructionに置く内容とreferencesへ分離する内容を分ける
3. 決定的に処理できるscript候補として分け出す
4. 入出力契約と失敗条件を表にする
5. skillとtool callingの違いを学習メモに残す

## 7. 確認観点

- skill定義に必要な項目を説明できるか
- 長い説明をreferencesへ分離する理由を説明できるか
- src/scripts/toolsへ送り出すかモック判断の基準を説明できるか

## 8. 後続工程への引き継ぎ

詳細設計では、`SKILL.md` の章立て、sample input/output、script例、失敗ケースを定義する。
