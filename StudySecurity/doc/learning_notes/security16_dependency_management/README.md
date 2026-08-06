# security16 依存関係管理

架空packageの監査report JSONを読み、severity別summaryと対応候補へ変換するCLI教材です。外部registryには接続しません。出力確認は15分、更新・代替・保留の判断を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- vulnerability reportとremediation判断を区別できる
- severityだけでなく到達可能性、修正有無、互換性影響を考慮できる
- direct dependencyとtransitive dependencyの更新経路を区別できる
- 更新後にtest、review、rollback計画が必要と説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [依存関係管理 要件定義](../../requirements/security16_dependency_management_requirements.md) |
| 基本設計 | [依存関係管理 基本設計](../../basic_design/security16_basic_design.md) |
| 詳細設計 | [依存関係管理 詳細設計](../../detailed_design/security16_detailed_design.md) |
| 補足 | [Remediation policy](./remediation_policy.md) |
| 実装 | [security16 ソース](../../../src/backend/src/studysecurity/systems/security16_dependency_management/) |

## 資料を見る前の確認問題

1. severityがhighなら、直ちにmajor versionへ自動更新してよいですか。
2. vulnerable code pathへ到達しないことは、永久に対応不要という意味ですか。
3. transitive dependencyはどのpackageを更新すれば解消するか、どう調べますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security16_dependency_management run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security16_dependency_management run demo
```

出力の`summary`がhigh 1件・moderate 1件で、`actions`がseverity順に並ぶことを確認します。`fixAvailable: true`は`update`、falseは`review`ですが、これは実行命令ではなく検討開始点です。

## コードを読む順番

1. [`npm_audit_sample.json`](../../../src/backend/src/studysecurity/systems/security16_dependency_management/samples/npm_audit_sample.json): 架空の入力schemaを見る
2. [`audit_report_parser.js`](../../../src/backend/src/studysecurity/systems/security16_dependency_management/app/audit_report_parser.js): 入力検証、正規化、sort、集計を追う
3. [`remediation_policy.md`](./remediation_policy.md): update以外の判断材料を確認する

## 観察ポイント

- `vulnerabilities`が配列でなければ処理を続けない
- unknown severityは既知severityより後ろへ置く
- `fixAvailable`は互換性や回帰riskを評価済みという意味ではない
- lockfileは再現可能性を高めるが、既知脆弱性を自動解消しない
- 保留にも理由、owner、期限、再評価条件を残す

## 安全な改造課題

1. critical、low、unknownをsampleへ追加してsortを確認する。
2. reachability、internet exposure、asset importanceを対応候補へ加える。
3. direct・transitiveの違いと更新元packageをschemaへ追加する。
4. update、代替、緩和、保留のdecision recordを設計する。

## 自分の言葉で説明する

- advisoryの検出と自systemのrisk判断の違い
- 自動updateの利点とbreaking change・supply chain risk
- lockfile、SBOM、定期scan、testの役割

## 学習用実装の制約

- 架空packageだけを使い、実advisoryではない
- registry、network、実projectのdependencyへ接続しない
- package update、lockfile変更、SBOM生成を行わない

## 学習完了の目安

- レベル1（再現）: summaryとseverity順の対応候補を確認できる
- レベル2（説明）: severityとremediation判断の違いを説明できる
- レベル3（改造）: owner・期限・testを含む依存関係更新workflowを設計できる
