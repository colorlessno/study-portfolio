# db04 トランザクション・ロック・分離レベル

commit、rollback、同時更新、lock wait、分離レベルを、残高と注文の変化から観察します。

## 到達目標

- トランザクション境界とACIDの関係を説明できる。
- 待機しているセッションとロック保持側を区別できる。
- 分離レベルごとに防げる現象と残る現象を整理できる。

## 教材

- [SQL教材](../../../src/apps/db04_transaction_lock_isolation/README.md)
- [トランザクション記録](docs/transaction_log.md)
- [同時更新記録](docs/concurrent_update_log.md)
- [分離レベル表](docs/isolation_matrix.md)
- [要件定義](../../requirements/db04_transaction_lock_isolation_requirements.md) / [基本設計](../../basic_design/db04_basic_design.md) / [詳細設計](../../detailed_design/db04_detailed_design.md)

## 始める前の問い

- `ROLLBACK` 後に残る変更はあるか。
- 2セッションが同じ行を更新すると、後から来た側はどうなるか。
- ロック待ちが長引いた場合、アプリケーションには何が必要か。

## 15分で再開

```cmd
node StudyDB\scripts\validate-studydb.mjs db04
```

検証後、stocksとordersの最終件数を確認し、commitされた操作とrollbackされた操作を区別して記録します。

## 同時更新を安全に観察する

手動演習では [SQL教材](../../../src/apps/db04_transaction_lock_isolation/README.md) の手順に従い、2つのターミナルを使います。session Aには60秒のアイドル中トランザクション制限、session Bには5秒のロック待ち制限があります。

1. session Aを開始し、対象行を更新したまま止める。
2. session Bを開始し、同じ行の更新が5秒で打ち切られることを確認する。
3. session Aを必ず `ROLLBACK` または `COMMIT` で終了する。
4. 待機の原因、保持側、解除方法を同時更新記録へ残す。

## 完了条件

commit、rollback、ロック競合、分離レベルについて「何を守る仕組みか」を説明できれば完了です。待機中のターミナルを放置せず、接続先はローカル教材DBだけにします。
