# web50 N+1問題の再現 詳細設計

## 0. 関連文書

- `../requirements/web50_n_plus_one_reproduction_requirements.md`
- `../basic_design/web50_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web50_n_plus_one_reproduction/
  Dockerfile
  package.json
  app/src/server.js
doc/learning_notes/web50_n_plus_one_reproduction/
  README.md
  docs/query_log_comparison.md
  docs/n_plus_one_note.md
```

## 2. 現在の位置付け

DB・ORMを使わず、配列と疑似query counterでN+1構造を再現する概念サンプル。実SQL・実行時間・DB負荷は計測しない。

## 3. Data

| Data | 件数 | Relation |
|---|---:|---|
| users | 3 | id 1〜3 |
| tasks | 3 | userIdでuserへ所属 |

user Aは2件、Bは1件、Cは0件のtaskを持つ。

## 4. Mode

| mode | 疑似処理 | Query count |
|---|---|---:|
| `n_plus_one` | user一覧後、userごとにtasks取得 | 4 |
| `optimized` | user一覧とtasks一括取得 | 2 |

`optimized`以外のmodeはN+1側で処理する。

## 5. 処理手順

1. queryからmodeを取得する。
2. 親一覧1回としてqueriesを1で初期化する。
3. optimizedではtasks一括取得を加えて2とする。
4. n_plus_oneではuserごとにqueriesを1増やす。
5. userIdでtasksを対応付ける。
6. mode・queries・resultをJSONで返す。

## 6. 要件との差分・既知の課題

- ORM・DB・SQL logを使用しない。
- query countは実測ではなくcounterである。
- eager loadingのSQLやJOINを実装しない。
- 親件数増加時のdurationを測定しない。
- endpoint path・modeをvalidationしない。

## 7. 確認手順

1. n_plus_oneでqueries 4を確認する。
2. optimizedでqueries 2を確認する。
3. 両modeのresultが同じことを確認する。
4. usersを増やし、N+1側だけquery数が比例することを確認する。
5. 実DB版ではSQL logでquery回数を確認する。

## 8. 完了条件

- 1+Nの構造を説明できる。
- 改善前後のquery数を比較できる。
- 子0件の親にもqueryが発生し得る理由を説明できる。
- 疑似counterと実DB計測を混同しない。
