# security21 AIコンテンツ判定

抽象化した意図とcontextからcategory、decision、reason code、安全応答、human review要否を決めるCLI教材です。不適切内容の本文は保存・再掲しません。6 caseの確認は15分、policy運用を説明するまでは60〜120分が目安です。

## このテーマでできるようになること

- taxonomy、decision、reason codeを分けてpolicy化できる
- 同じcategoryでも教育・分類等のcontextでboundaryが変わることを説明できる
- refusalとsafe completion、緊急escalationを区別できる
- full contentを保存せず最小限のaudit recordを作れる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [AI content moderation 要件定義](../../requirements/security21_ai_content_moderation_requirements.md) |
| 基本設計 | [AI content moderation 基本設計](../../basic_design/security21_basic_design.md) |
| 詳細設計 | [AI content moderation 詳細設計](../../detailed_design/security21_detailed_design.md) |
| Taxonomy | [Content safety taxonomy](./docs/content_safety_taxonomy.md) |
| Case | [Moderation case table](./docs/moderation_case_table.md) |
| Audit | [Audit log schema](./docs/audit_log_schema.md) |
| 応答 | [Safe response examples](./docs/safe_response_examples.md) |
| Escalation | [Escalation notes](./docs/escalation_notes.md) |
| 実装 | [security21 ソース](../../../src/backend/src/studysecurity/systems/security21_ai_content_moderation/) |

## 資料を見る前の確認問題

1. categoryと最終decisionは常に1対1ですか。
2. 判定のために入力全文をaudit logへ保存する必要がありますか。
3. `refuse`と`escalate`では、user-facing responseと運用対応がどう違いますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security21_ai_content_moderation run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security21_ai_content_moderation run demo
```

M-001〜M-006が全て期待decisionと一致して`ALL CASES PASSED`になることを確認します。その後のaudit recordに意図本文がなく、category、reason、短いhash、review要否だけがあることを確認します。

## コードを読む順番

1. [`content_safety_taxonomy.md`](./docs/content_safety_taxonomy.md): categoryと境界を確認する
2. [`policy.js`](../../../src/backend/src/studysecurity/systems/security21_ai_content_moderation/app/policy.js): decision・reason・安全応答を追う
3. [`moderator.js`](../../../src/backend/src/studysecurity/systems/security21_ai_content_moderation/app/moderator.js): rule優先順位とcontext分岐を見る
4. [`audit_logger.js`](../../../src/backend/src/studysecurity/systems/security21_ai_content_moderation/app/audit_logger.js): data最小化とreview flagを確認する
5. [`demo.js`](../../../src/backend/src/studysecurity/systems/security21_ai_content_moderation/app/demo.js): 文書caseと実装期待値を比較する

## 観察ポイント

- imminent riskに関するruleを先に評価して優先度を表す
- classification・教育contextは内容の詳細再掲を許可する意味ではない
- keyword ruleの`confidence`はmodel確率ではなく教材上の固定label
- refusalでも理由categoryの過剰開示やsensitive textの反復を避ける
- hashは本文の代替識別子だが、低entropy入力では推測riskを評価する
- policy version、reviewer、override理由はproduction auditの追加候補

## 安全な改造課題

1. case tableから自動test inputを生成する。
2. policy versionとrule IDをaudit recordへ追加する。
3. multiple categoryが一致した場合の優先順位・合成policyを設計する。
4. false positive、false negative、appeal、human overrideのworkflowを作る。

## 自分の言葉で説明する

- taxonomy、classification、decision、responseの違い
- context-sensitive policyと一貫したreason codeの関係
- automationとhuman reviewの責務分担

## 学習用実装の制約

- 抽象caseとkeyword ruleだけで実content moderation modelではない
- 不適切内容の詳細本文を扱わない
- 外部API、実user data、実escalation窓口へ接続しない

## 学習完了の目安

- レベル1（再現）: 6 caseとaudit recordを確認できる
- レベル2（説明）: category・context・decision・reviewを説明できる
- レベル3（改造）: versioning・evaluation・appealを含むpolicy運用を設計できる
