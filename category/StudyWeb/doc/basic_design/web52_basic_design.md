# web52 基本設計
## Modern web rendering comparison

## 0. 関連要件

- `../requirements/web52_modern_rendering_comparison_requirements.md`

## 1. 設計目的

MPA、SPA、SSR、SSG、Server Components、Islands Architecture、PWA を、同じ一覧画面の要件に当てはめて比較できる教材にする。

## 2. 対象範囲

- MPA / SPA / SSR / SSG
- Server Components
- Islands Architecture
- PWA
- hydration
- routing and data fetching
- SEO、初期表示、操作性、開発複雑性、運用

## 3. 成果物構成

```text
category/StudyWeb/
  doc/learning_notes/web52_modern_rendering_comparison/
    README.md
    docs/
      rendering_mode_matrix.md
      list_screen_comparison.md
      api_cache_auth_relation.md
      studyweb_mapping.md
```

## 4. 入力

| 入力 | 内容 |
|---|---|
| 共通画面 | 商品一覧または記事一覧 |
| 比較観点 | SEO、初期表示、操作性、開発複雑性、運用 |
| データ取得条件 | API取得、キャッシュ、認証、更新頻度 |
| 既存StudyWeb | routing、API、認証、キャッシュ、状態管理の既存テーマ |

## 5. 出力

| 出力 | 内容 |
|---|---|
| 表示方式比較表 | 各方式の特徴、向く要件、注意点 |
| 一覧画面比較 | 同じ画面を複数方式で考えた場合の差分 |
| 関連整理 | 既存StudyWebテーマとの対応 |
| 選定メモ | 要件別にどの方式を選ぶかの理由 |

## 6. 処理方針

1. 共通の一覧画面要件を定義する
2. 各表示方式でのデータ取得と描画責務を整理する
3. SEO、初期表示、操作性、複雑性を比較する
4. API、キャッシュ、認証との関係を整理する
5. 既存StudyWebテーマとの対応を記録する

## 7. 確認観点

- MPA、SPA、SSR、SSGの違いを説明できるか
- 流行語ではなく要件から表示方式を選べるか
- API取得、キャッシュ、認証との関係を説明できるか

## 8. 後続工程への引き継ぎ

詳細設計では、比較表の列、共通画面要件、既存StudyWeb対応表、選定シナリオを定義する。

