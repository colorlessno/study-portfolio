# EXPLAIN Note

| 項目 | 見る理由 |
|---|---|
| scan method | Seq Scan / Index Scan等の選択 |
| cost | plannerの相対的な見積り |
| estimated rows | plannerが予測した件数 |
| actual rows | 実際に通過した件数 |
| loops | nodeが繰り返された回数 |
| planning time | plan作成時間 |
| execution time | 実行時間 |
| buffers | pageのhit / read状況 |

## 注意点

- 1回のexecution timeだけで結論を出さない
- cacheの温まり方で結果が変わる
- 小さいtableではSeq Scanの方が合理的な場合がある
- indexがあっても検索条件が合わなければ使われない
- `LIKE '%word%'`は通常のB-treeと相性が悪い
- indexはinsert / update / deleteとstorageにcostを追加する

EXPLAINは「indexを使わせる」道具ではなく、plannerの判断と実データの動きを理解する入口。
