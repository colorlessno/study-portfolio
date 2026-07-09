# system45 詳細設計

## Agent skill packaging

## 0. 関連要件

- `../requirements/system45_agent_skill_packaging_requirements.md`
- `../basic_design/system45_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/system45_agent_skill_packaging/
  README.md
  docs/
    skill_contract.md
    reference_split.md
    failure_patterns.md
    skill_vs_tool_calling.md
  sample_skill/
    SKILL.md
    references/
      checklist.md
      examples.md
    src/scripts/
      validate_input.js
```

## 2. `SKILL.md` 設計

| section | 内容 |
|---|---|
| name | skill名 |
| description | いつ使うskillか、いつ使わないか |
| inputs | 必須入力、任意入力、禁止入力 |
| outputs | 期待する成果物 |
| constraints | 安全制約・対象外・権限境界 |
| workflow | 参照文書の読み方、script利用、失敗時対応 |
| failure handling | 入力不足、権限不足、危険操作の扱い |

## 3. contract 設計

| 項目 | 内容 |
|---|---|
| required input | task goal、target file、expected output |
| optional input | style guide、sample、reference path |
| forbidden input | secrets、token、password、個人情報 |
| output | markdown report、generated file、validation result |
| refusal / stop | 危険操作、不足情報、権限不足 |

## 4. reference分割設計

| ファイル | 置く内容 |
|---|---|
| `SKILL.md` | 常に必要な短い指示 |
| `references/checklist.md` | 長い確認観点 |
| `references/examples.md` | 入出力例、失敗例 |
| `src/scripts/validate_input.js` | 決定的に検査できる入力チェック |

scriptはモデル判断の代替ではなく、決定的に検査できる前提条件として扱う。

## 5. script設計

| script | 入力 | 出力 | 目的 |
|---|---|---|---|
| `validate_input.js` | JSON fixture | validation result | 必須項目、禁止語、path形式を検査 |

scriptはモデル判断の代替ではなく、決定的に検査できる前提条件として扱う。

## 6. 失敗パターン設計

| case | 判断 | 対応 |
|---|---|---|
| required input missing | stop | 不足項目を列挙する |
| forbidden input included | stop | 秘密情報・個人情報を扱わない |
| unsafe operation requested | stop / approval | 危険操作の理由と承認境界を示す |
| reference too large | continue | 必要部分だけ読む |
| script failed | stop | stderrと再実行条件を記録する |

## 7. 確認手順

1. sample inputをcontractへ当てはめる
2. `validate_input.js` で必須項目を検査する
3. `SKILL.md` とreferencesの分割を確認する
4. 失敗パターンを1件ずつ記録する
5. skillとtool callingの違いを学習メモにまとめる

## 8. 完了条件

- skill定義に必要な項目を説明できる
- referencesとscriptsへ分割する理由を説明できる
- 入力不足、権限不足、危険操作時の対応を説明できる

## 9. 安全性

- sampleにsecrets、token、password、個人情報を含めない
- 外部サービス操作やmarketplace公開は行わない
- scriptは教材workspace内のfixtureだけを読む
