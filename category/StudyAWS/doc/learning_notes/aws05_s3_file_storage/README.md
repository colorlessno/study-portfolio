# aws05 S3ファイル保存

ローカルディレクトリをbucket相当として使い、object key、upload、list、get、不正な相対パスの拒否を観察します。実S3へは接続しません。

## 到達目標

- bucket、object、keyと通常のディレクトリの違いを説明できる。
- objectの公開範囲、暗号化、versioning、lifecycleを選択肢として整理できる。
- user入力をそのままobject keyやローカルパスへ使う危険性を説明できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws05_s3_file_storage/)
- [object storageメモ](docs/object_storage_notes.md) / [公開設定チェック](docs/public_access_checklist.md)
- [要件定義](../../requirements/aws05_s3_file_storage_requirements.md) / [基本設計](../../basic_design/aws05_basic_design.md) / [詳細設計](../../detailed_design/aws05_detailed_design.md)

## 15分で再開

```powershell
node category/StudyAWS\scripts\validate-studyaws.mjs aws05
```

手動で出力を見る場合:

```powershell
npm --prefix category/StudyAWS\src\backend\src\studyaws\systems\aws05_s3_file_storage run demo
```

`docs/sample.txt`が一覧に現れる理由と、`../secret.txt`が拒否される理由を説明します。

## 境界と完了条件

ローカルファイルはS3 API、IAM、署名URL、整合性、versioning、lifecycleを再現しません。実S3ではBlock Public Accessを前提に、保持期間と削除責任を決めます。正本と公開用派生物を区別できれば完了です。
