# web51 indexあり/なし検索比較

PostgreSQLへ10,000件のproductsを投入し、name完全一致検索の実行計画をB-tree indexの作成前後で比較するSQL教材。Node.js部分は実行案内を表示するだけで、DB環境は別途用意する。

## このテーマで身につけること

- sequential scanとindex scanの違いをEXPLAINから読む
- 検索条件に合うindexを選ぶ理由を説明する
- indexがreadを助ける一方、write・storage costを増やすことを理解する
- 同じSQL・同じデータで作成前後を比較する

## 10分で再開する

構成と案内を確認するだけならNode.js 20以上で次を実行する。

```powershell
cd category/StudyWeb\src\backend\src\studyweb\systems\web51_index_search_comparison
npm.cmd start
```

実比較にはPostgreSQL sandboxと`psql`が必要。接続先DBを用意してから、対象directoryで実行する。

```powershell
psql -d studyweb -f db/schema.sql
psql -d studyweb -f db/seed.sql
psql -d studyweb -c "analyze products;"
psql -d studyweb -c "explain (analyze, buffers) select * from products where name = 'product-9999';"
```

接続先に応じてhost・port・user等を追加する。本番DBや共有DBではなく、削除可能な学習用DBを使う。

## Indexを追加して比較する

```powershell
psql -d studyweb -c "create index idx_products_name on products(name);"
psql -d studyweb -c "analyze products;"
psql -d studyweb -c "explain (analyze, buffers) select * from products where name = 'product-9999';"
```

手順は [Index Comparison](docs/index_comparison.md)、読む項目は [EXPLAIN Note](docs/explain_note.md) を参照する。

## ファイルを読む順番

1. `db/schema.sql`でproductsの列と、comment化されたindexを見る
2. `db/seed.sql`で10,000件の生成規則を見る
3. `app/src/explain-note.js`で、このthemeがSQL実習中心であることを確認する
4. index作成前のEXPLAIN結果を保存する
5. name indexを作成し、同じSQLを再実行する
6. scan method、estimated / actual rows、execution time、buffersを比較する

## 現実装の範囲

- DockerfileはNode.jsの案内だけを実行し、PostgreSQLを起動しない
- package scriptはDB接続・seed・計測を自動化しない
- schemaは初期状態でindex作成行をcommentにしている
- 10,000件では環境・cache状況により時間差が小さい場合がある
- name完全一致と通常B-treeの基本比較だけを扱う
- 複合index、partial index、全文検索、運用監視は対象外

## 壊して確かめる

- index作成前後のplanをファイルへ記録し、scan methodを比較する
- 同じqueryを複数回実行し、cacheによる時間差を観察する
- `status`検索を試し、値の偏りとindex選択を考える
- `LIKE '%9999%'`を試し、通常B-treeが使われにくい理由を調べる
- insert / updateのEXPLAINや処理時間からwrite costを考える
- 不要indexを`drop index idx_products_name`で削除する

## 自分の言葉で説明する

- indexは本の索引とどこが似ているか
- plannerがindexを常に使うとは限らないのはなぜか
- 検索条件とindex列・順序にはどんな関係があるか
- indexを増やしすぎると何が悪化するか

## 完了条件

- 学習用DBへschema・10,000件を投入した
- index作成前後で同じEXPLAIN ANALYZEを実行した
- scan method・rows・time・buffersを記録した
- read benefitとwrite / storage costの両方を説明できる
