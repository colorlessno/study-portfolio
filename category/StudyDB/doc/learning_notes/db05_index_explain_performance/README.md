# db05 index・EXPLAIN・性能確認

indexの有無でPostgreSQLの実行計画がどう変わるかを比較し、速さを推測ではなく根拠から説明します。

## 到達目標

- `Seq Scan` と `Index Scan` が選ばれた理由を説明できる。
- indexが常に使われるわけではない理由を説明できる。
- 実行時間の絶対値ではなく、plan・行数見積り・相対変化を比較できる。

## 教材

- [SQL教材](../../../src/apps/db05_index_explain_performance/README.md)
- [EXPLAIN記録](docs/explain_log.md)
- [性能観察](docs/performance_observation.md)
- [StudyWebとの関係](docs/studyweb_relation.md)
- [要件定義](../../requirements/db05_index_explain_performance_requirements.md) / [基本設計](../../basic_design/db05_basic_design.md) / [詳細設計](../../detailed_design/db05_detailed_design.md)

## 始める前の問い

- 2万行のテーブルで1件を探す場合、indexなしでは何を読むか。
- 結果の大半を返す検索でもindexが有利か。
- index追加で増える書き込みコストは何か。

## 15分で再開

```cmd
node category/StudyDB\scripts\validate-studydb.mjs db05
```

検証はサンプルデータを作り、index作成前後のSQLと4つの教材用indexを確認します。

## 実行計画を比較する

```cmd
docker compose -f category/StudyDB\src\apps\common\docker-compose.yml up -d --wait --wait-timeout 30 db
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\001_schema.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\002_seed_small.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\003_seed_large.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\004_explain_without_index.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\005_create_indexes.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\006_explain_with_index.sql
category/StudyDB\src\apps\common\scripts\run-sql.cmd db05 sql\007_ineffective_index_examples.sql
```

各planについてscan方式、推定行数、実測行数、filterで除外された行を記録します。環境差の大きいミリ秒値だけで良否を決めません。

## 後片付けと完了条件

```cmd
docker compose -f category/StudyDB\src\apps\common\docker-compose.yml down
```

有効なindexと効きにくいindexを1例ずつ、実行計画を根拠に説明できれば完了です。
