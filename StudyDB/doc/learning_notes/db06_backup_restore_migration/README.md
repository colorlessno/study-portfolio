# db06 バックアップ・リストア・マイグレーション安全性

backup取得、restore確認、migration前後のcheckを行う。

## 方針

- backupファイルは生成物としてgit管理外。
- `.gitkeep` とログだけ残す。
- 共通DB構成を使う。

