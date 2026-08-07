# security19 データ保持・削除

data種別ごとの保持日数、record age、legal holdから削除候補をdry runするCLI教材です。実fileや実databaseは削除しません。判定再現は15分、end-to-end削除を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- data種別ごとにretention policyを分けられる
- 保持期間の境界日を明確に判定できる
- legal holdを通常の削除policyより優先できる
- unknown・不正dataを安全側に倒し、理由を記録できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [Data保持・削除 要件定義](../../requirements/security19_data_retention_requirements.md) |
| 基本設計 | [Data保持・削除 基本設計](../../basic_design/security19_basic_design.md) |
| 詳細設計 | [Data保持・削除 詳細設計](../../detailed_design/security19_detailed_design.md) |
| 補足 | [Deletion workflow](./deletion_workflow.md) |
| 実装 | [security19 ソース](../../../src/backend/src/studysecurity/systems/security19_data_retention/) |

## 資料を見る前の確認問題

1. 「365日保持」は、ageが365日になった時点で削除可能ですか、それとも366日目ですか。
2. primary databaseから消せば、backupやsearch indexからも消えますか。
3. unknownなdata typeを既定の短い保持期間で削除してよいですか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security19_data_retention run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security19_data_retention run demo
```

| case | 期待reason | delete |
|---|---|---:|
| 期限超過order | retention_expired | true |
| 期間内inquiry | within_retention | false |
| legal hold audit | legal_hold | false |
| ちょうど365日のorder | retention_expired | true |
| unknown type | unknown_type | false |

## コードを読む順番

1. [`deletion_workflow.md`](./deletion_workflow.md): dry runから証跡までの順序を見る
2. [`retention_policy.js`](../../../src/backend/src/studysecurity/systems/security19_data_retention/app/retention_policy.js): type・日付・境界・hold判定を追う
3. [`demo.js`](../../../src/backend/src/studysecurity/systems/security19_data_retention/app/demo.js): 5つのcaseと固定判定日を確認する

## 観察ポイント

- `ageDays >= retentionDays`として境界をcodeと文書で一致させる
- unknown type、不正日付、未来日付は自動削除しない
- legal holdは期限超過より先に最終reasonへ反映する
- dry runにはIDだけでなくage、policy、reasonを残す
- 実行時は対象件数上限、再確認、idempotency、partial failureも考える

## 安全な改造課題

1. 不正日付・未来日付のtest caseを追加する。
2. policy versionと判定日時を結果へ加える。
3. dry run結果を承認後の実行requestへ安全に結び付けるIDを設計する。
4. primary、backup、cache、index、analyticsの削除期限を表にする。

## 自分の言葉で説明する

- data最小化と法的・業務上の保持のtrade-off
- legal holdが設定・解除されるworkflow
- dry run、承認、削除、確認、監査の各段階

## 学習用実装の制約

- 固定の教材policyと判定日を使う
- 実dataを削除・更新しない
- timezone、backup、distributed deletionを実装しない

## 学習完了の目安

- レベル1（再現）: 5つのreasonとdelete可否を確認できる
- レベル2（説明）: 境界日・legal hold・dry runを説明できる
- レベル3（改造）: 全保存先を含む削除workflowを設計できる
