# aws10 バックアップ / リストア

ダミーJSONを使い、backup作成、restoreのdry-run、変更後の復元を隔離した一時領域で確認します。

## 到達目標

- backupの存在とrestore可能性を区別できる。
- RPO、RTO、保持期間を業務要件から説明できる。
- 復元対象、上書き範囲、事後確認を実行前に決められる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws10_backup_restore/)
- [復旧チェック](docs/recovery_checklist.md) / [RPO・RTO](docs/rpo_rto_notes.md)
- [要件定義](../../requirements/aws10_backup_restore_requirements.md) / [基本設計](../../basic_design/aws10_basic_design.md) / [詳細設計](../../detailed_design/aws10_detailed_design.md)

## 始める前の問い

- 最新backupが壊れていた場合、どこまで戻れるか。
- dry-runでは何を確認し、何をまだ証明できないか。
- restore後に件数だけ確認すれば十分か。

## 15分で再開

```powershell
node StudyAWS\scripts\validate-studyaws.mjs aws10
```

検証は教材データをOSの一時領域へコピーし、backup、データ変更、dry-run、実restore、内容一致を確認して一時領域を削除します。教材ディレクトリのデータや既存backupは変更しません。

## 手を動かす課題

復旧チェックへ、復元前、復元中、復元後の確認を3つずつ書きます。RPO・RTOメモでは「1日1回backup」と「15分以内に復旧」の組合せが現実的か説明します。

## 境界と完了条件

JSONコピーはRDS snapshot、S3 versioning、cross-region copy、暗号化、保持課金を再現しません。実データでは実行せず、復元テストと削除方針を含めて説明できれば完了です。
