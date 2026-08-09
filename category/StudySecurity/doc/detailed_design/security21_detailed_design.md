# security21 詳細設計
## AI content moderation / NSFW classification

## 0. 関連文書

- `../requirements/security21_ai_content_moderation_requirements.md`
- `../basic_design/security21_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/security21_ai_content_moderation/
  README.md
  docs/
    content_safety_taxonomy.md
    moderation_case_table.md
    audit_log_schema.md
    safe_response_examples.md
    escalation_notes.md
src/backend/src/studysecurity/systems/security21_ai_content_moderation/
  package.json                … scripts: check（構文）、demo（ケース実行＋検証）
  Dockerfile
  app/policy.js               … CATEGORIES / DECISIONS / REASON_CODES / SAFE_RESPONSES
  app/moderator.js            … ルールベース判定エンジン moderate(input)
  app/audit_logger.js         … buildAuditRecord(): sha256 hash 参照で full content 非保存
  app/demo.js                 … M-001〜M-006 を期待判定つきで実行、全件一致で exit 0
```

実装は依存パッケージゼロの Node で、他の securityXX と同一構成とする。
入力は「意図の抽象サマリ＋文脈」であり、不適切内容の本文そのものは扱わない。

## 2. taxonomy 設計

| category | 内容 | 扱い |
|---|---|---|
| sexual / NSFW | 性的内容、露骨性、未成年関連の危険 | 抽象化して扱い、露骨な生成はしない |
| violence | 暴力、傷害、残虐表現 | 詳細な加害手順を扱わない |
| self-harm | 自傷、自殺 | 支援案内とエスカレーションを重視 |
| privacy | 個人情報、認証情報 | 収集・公開・推測を禁止 |
| hate / harassment | 差別、嫌がらせ | 保護属性や攻撃性を分類 |
| illegal activity | 違法行為 | 実行支援を禁止 |

## 3. 判定レベル設計

| decision | 内容 | 応答方針 |
|---|---|---|
| allow | 一般的で安全な内容 | 通常回答 |
| caution | 文脈に注意が必要 | 安全な範囲に限定 |
| refuse | 支援してはいけない内容 | 短く拒否し、安全な代替を提示 |
| escalate | 自傷や重大危険など | 支援先や人間確認へつなぐ |

## 4. 抽象ケース設計

| case id | category | context | expected decision |
|---|---|---|---|
| `M-001` | NSFW | 成人向け露骨描写の生成依頼 | refuse |
| `M-002` | NSFW | 医療・教育文脈の一般説明 | caution / allow |
| `M-003` | privacy | 個人情報の推測依頼 | refuse |
| `M-004` | self-harm | 自傷意図を含む相談 | escalate |
| `M-005` | harassment | 特定属性への攻撃文生成 | refuse |

ケースは抽象化し、不適切内容の詳細本文は書かない。

## 5. audit log schema

| field | 内容 |
|---|---|
| `input_id` | 入力識別子 |
| `category` | taxonomy分類 |
| `severity` | low、medium、high |
| `decision` | allow、caution、refuse、escalate |
| `reason` | 判定理由 |
| `safe_response_type` | normal、bounded、refusal、support |
| `reviewer` | auto / human |
| `timestamp` | ISO 8601 |

## 6. safe response 設計

| type | 内容 |
|---|---|
| `normal` | 通常回答 |
| `bounded` | 安全な一般説明に限定 |
| `refusal` | 対応できない理由と安全な代替 |
| `support` | 支援先、緊急時の相談先、人間への相談促進 |

## 7. 確認手順

1. taxonomyを読む
2. 抽象ケースを分類する
3. decisionと理由を記録する
4. audit log項目へ変換する
5. safe response例を作る

## 8. 完了条件

- NSFWを含む安全性分類を説明できる
- 許可、注意、拒否、エスカレーションの判断理由を記録できる
- moderationログに残す項目を説明できる

## 9. 安全性

- 露骨な性的・暴力的内容の詳細生成を目的にしない
- ケースは抽象化し、実個人情報を含めない
- 実サービスのポリシー策定や法的判断の代替にしない

