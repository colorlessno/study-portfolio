# security17 Prompt Injection対策 詳細設計
## 0. 関連文書

- `../requirements/security17_prompt_injection_requirements.md`
- `../basic_design/security17_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studysecurity/systems/security17_prompt_injection/
  README.md
  Dockerfile
  public/index.html
  public/app.js
  samples/prompts.json
  docs/guardrail_policy.md
```

## 2. 主要設計
| 要素 | 内容 |
|---|---|
| 入力の種類 | ユーザー指示、システム指示、検索文書を分けて表示する |
| 危険例 | 指示上書き風の文をローカルサンプルとして扱う |
| 防御例 | 参照文書を信頼しない前提の応答方針を示す |
| 判定 | 拒否、要確認、通常回答の3区分にする |

## 3. 安全制約
- 外部AI APIには送信しない。
- promptだけで完全防御できるとは説明しない。
- 悪用手順ではなく、境界整理と確認観点を学習対象にする。
## 4. 確認手順
1. 通常質問を入力して通常回答区分になることを確認する。
2. 指示上書き風サンプルで要確認または拒否になることを確認する。
3. 参照文書とユーザー指示の境界を確認する。
4. 防御の限界を読む。
## 5. 完了条件

- Prompt Injectionの信頼境界を説明できる。
- RAG文書を命令として扱わない理由を説明できる。
- ガードレールの限界を説明できる。
