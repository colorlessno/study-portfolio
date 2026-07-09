# web51 indexあり/なし検索比較詳細設計
## 0. 関連文書

- `../requirements/web51_index_search_comparison_requirements.md`
- `../basic_design/web51_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web51_index_search_comparison/
  Dockerfile
  package.json
  app/src/explain-note.js
  db/schema.sql
  db/seed.sql
doc/learning_notes/web51_index_search_comparison/
  README.md
  docs/index_comparison.md
  docs/explain_note.md
```

## 2. 主要設計
| 比較| 内容|
|---|---|
| indexない| 通常検索 |
| indexあり | 検索列にindex追加 |
| 計測 | 実行時間。XPLAIN |

## 3. 確認手順
1. seedを投入する
2. indexなしで検索する
3. 実行時間とXPLAINを記録する
4. indexを追加する
5. 同じ検索を比較る
## 4. 完了条件

- indexあり/なしを比較きる
- 検索条件とindexの関係を説明できる
- indexの更新コストにも触れてい

