# db06 バックアップ・リストア・マイグレーション安全性

バックアップを「取得した」だけで終えず、別DBへの復元とmigration前後の確認までを一連の運用として学びます。

## 到達目標

- backupとrestoreを別の操作として説明できる。
- migration前後の不変条件をSQLで確認できる。
- 失敗時の中止条件とrollback方針を事前に書ける。

## 教材

- [SQL教材と手動復元手順](../../../src/apps/db06_backup_restore_migration/README.md)
- [backup・restore記録](docs/backup_restore_log.md)
- [migrationチェックリスト](docs/migration_checklist.md)
- [rollback計画](docs/rollback_plan.md)
- [StudyAWSとの関係](docs/studyaws_relation.md)
- [要件定義](../../requirements/db06_backup_restore_migration_requirements.md) / [基本設計](../../basic_design/db06_basic_design.md) / [詳細設計](../../detailed_design/db06_detailed_design.md)

## 始める前の問い

- dumpファイルが存在するだけで復旧可能と言えるか。
- 元DBへrestoreしないのはなぜか。
- 列追加後も守るべき行数・NULL・既定値は何か。

## 15分で再開

```cmd
node category/StudyDB\scripts\validate-studydb.mjs db06
```

検証は一時dumpを作成し、隔離した `studydb_restore` へ復元して件数を確認した後、migrationと変更後チェックを実行します。終了時に一時環境は削除されます。

## 手動演習

[SQL教材と手動復元手順](../../../src/apps/db06_backup_restore_migration/README.md) に従い、次の順で行います。

1. schemaとseedを作成し、migration前チェックを記録する。
2. `db06` schemaをdumpする。
3. 元DBではなく `studydb_restore` へrestoreする。
4. 復元件数を確認してからmigrationを適用する。
5. migration後チェックとrollback計画を記録する。
6. 演習用復元DBを削除する。

backupファイルは生成物としてGit管理外です。実データ、本番DB、共有DBでは実行しません。

## 完了条件

復元結果、migration前後の不変条件、失敗時の判断を記録し、「戻せる根拠」を説明できれば完了です。
