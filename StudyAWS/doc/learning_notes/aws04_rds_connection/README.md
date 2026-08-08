# aws04 RDS接続

DB接続設定を環境変数へ分離し、必須値とsecretの表示方法を確認します。教材コードはPostgreSQLやRDSへ実接続しません。

## 到達目標

- endpoint、port、database、user、passwordの役割を説明できる。
- secretをコード、ログ、Gitへ残さない理由を説明できる。
- 接続失敗を名前解決、経路、認証、DB状態へ分けて調査できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws04_rds_connection/)
- [接続確認表](docs/connection_checklist.md) / [RDS固有の論点](docs/rds_notes.md)
- [要件定義](../../requirements/aws04_rds_connection_requirements.md) / [基本設計](../../basic_design/aws04_basic_design.md) / [詳細設計](../../detailed_design/aws04_detailed_design.md)

## 15分で再開

```powershell
node StudyAWS\scripts\validate-studyaws.mjs aws04
```

検証は、全設定がある場合にpasswordが`masked`となることと、必須設定が欠けた場合に失敗することを確認します。`.env.example`と出力を比べ、Git管理してよい値とsecretを分類します。

## 手を動かす課題

接続エラーを「timeout」「connection refused」「authentication failed」「database not found」の4種類に分け、最初に確認する場所を接続確認表へ書きます。

## 境界と完了条件

ローカル検証は接続設定の分離だけを証明し、DB接続成功、TLS、RDS Security Group、backup、Multi-AZを証明しません。実RDSはpublic accessを避け、作成前に課金と削除方法を確認します。
