# security17 Prompt Injection体験 基本設計
## 0. 関連要件

- `../requirements/security17_prompt_injection_requirements.md`

## 1. 設計目的
ユーザー入力でAI指示が上書きされる危険性と、防御の基本を疑似的に確認する。
## 2. 対象範囲

- malicious user input
- instruction separation
- output validation
- allowlist
- refusal policy

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security17_prompt_injection/
  README.md
  app/
  docs/prompt_injection_cases.md
  docs/defense_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| system instruction | 守るべき方針 |
| user input | 通常入力や攻撃入力 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| unsafe result | 指示上書き例 |
| guarded result | 検証・拒否結果 |
| notes | 防御の限界 |

## 6. 処理方針
1. 疑似AI処理で攻撃入力を確認する
2. 入力と指示を分ける
3. 出力形式を検証する
4. 危険要求を拒否する
5. promptだけでは完全防御できないと明記する
## 7. 確認観点

- 実APIキーを使っていないか
- 危険例と防御例がセットか
- AI出力を無条件に信用していないか

## 8. 後続工程への引き継ぎ

詳細設計では、攻撃入力、疑似判定、出力検証、確認手順を定義する。
