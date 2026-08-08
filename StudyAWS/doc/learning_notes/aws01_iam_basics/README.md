# aws01 IAM / 権限の基本

IAMポリシーを模したJSONをローカルで評価し、許可、暗黙deny、明示denyの優先関係を学びます。AWS CLIや認証情報は使いません。

## 到達目標

- 認証と認可を区別できる。
- 最小権限と明示denyの役割を説明できる。
- principal、action、resource、conditionの観点で実AWSとの差を指摘できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws01_iam_basics/)
- [権限表](docs/permission_matrix.md) / [トラブルシューティング](docs/troubleshooting_checklist.md)
- [要件定義](../../requirements/aws01_iam_basics_requirements.md) / [基本設計](../../basic_design/aws01_basic_design.md) / [詳細設計](../../detailed_design/aws01_detailed_design.md)

## 始める前の問い

- 許可の記述がない操作は許可されるか。
- allowと明示denyが同時に一致したらどちらが勝つか。
- アプリへ管理者権限を渡すと何が危険か。

## 15分で再開

```powershell
node StudyAWS\scripts\validate-studyaws.mjs aws01
```

次にポリシーJSONを読み、4操作の判定を予想してから手動実行します。

```powershell
npm --prefix StudyAWS\src\backend\src\studyaws\systems\aws01_iam_basics run demo
```

権限表へ予想と実測を記録し、1つの権限を削った場合の影響を説明します。

## 境界と完了条件

この評価器はIAM Policy Simulatorではなく、condition、NotAction、複数ポリシー、SCP等を扱いません。ローカル結果を実AWSの権限保証として使わず、allow、暗黙deny、明示denyを例付きで説明できれば完了です。
