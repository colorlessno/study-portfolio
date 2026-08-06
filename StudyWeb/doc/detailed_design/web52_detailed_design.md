# web52 詳細設計
## Modern web rendering comparison

## 0. 関連文書

- `../requirements/web52_modern_rendering_comparison_requirements.md`
- `../basic_design/web52_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/web52_modern_rendering_comparison/
  README.md
  docs/
    rendering_mode_matrix.md
    list_screen_comparison.md
    api_cache_auth_relation.md
    studyweb_mapping.md
    selection_scenarios.md
```

## 2. 比較対象

各用語は同じ軸の排他的な選択肢ではない。MPA / SPA / SSR / SSGはpage deliveryやHTML生成を比較し、Server Components / Islandsはcomponent・hydration戦略、PWAは複数構成へ追加できるapplication capabilityとして整理する。

| mode | 説明 |
|---|---|
| MPA | ページ遷移ごとにHTMLを取得 |
| SPA | 初期ロード後にブラウザ側で状態とroutingを管理 |
| SSR | request時にサーバでHTMLを生成 |
| SSG | build時にHTMLを生成 |
| Server Components | サーバ側でcomponent単位の処理を寄せる |
| Islands Architecture | 静的HTMLに必要部分だけhydrate |
| PWA | install、offline、pushなどアプリ的機能を付加 |

組合せ例:

- SSR + Server Components
- SSG + Islands
- SPA + PWA
- MPA + 一部client component

## 3. 比較表設計

| 列 | 内容 |
|---|---|
| SEO | crawlerが読みやすいか |
| initial display | 初期表示の速さ |
| interactivity | 画面操作の多さへの向き不向き |
| data fetching | どこでデータを取るか |
| auth | 認証・認可との相性 |
| cache | CDN、browser cache、server cacheとの関係 |
| complexity | 実装・運用の複雑性 |
| fit use case | 向く画面例 |

## 4. 共通画面シナリオ

| シナリオ | 要件 | 比較観点 |
|---|---|---|
| 商品一覧 | SEO、カテゴリ検索、ページング | MPA/SSR/SSG/SPA比較 |
| 管理画面一覧 | 認証、頻繁な操作、filter | SPA/SSR比較 |
| ブログ一覧 | SEO、低更新頻度 | SSG/SSR比較 |
| オフラインメモ | offline、再同期 | PWA比較 |

## 5. API / cache / auth 関係

| 観点 | 内容 |
|---|---|
| API取得 | client fetch、server fetch、build time fetch |
| cache | CDN、browser、server、stale while revalidate |
| auth | public page、login required page、role-based page |
| hydration | HTML表示後にJSが操作可能にする範囲 |

## 6. StudyWeb対応表

| StudyWeb | 関係 |
|---|---|
| web32-web36 | HTTP、Cookie、CORS、status、localStorageの前提 |
| web38-web40 | routing、CRUD、table UI |
| web41-web43 | APIエラー、pagination、idempotency |
| web49 | retry / timeout |
| web50-web51 | DBアクセスと性能観点 |

## 7. 確認手順

1. 共通画面シナリオを選ぶ
2. 表示方式ごとにデータ取得と描画責務を書く
3. SEO、初期表示、操作性、複雑性を比較する
4. API、cache、authの関係を整理する
5. StudyWeb既存テーマとの対応を記録する

## 8. 完了条件

- MPA、SPA、SSR、SSGの違いを説明できる
- 要件から表示方式を選定できる
- API取得、cache、auth、hydrationの関係を説明できる

## 9. 安全性

- 特定フレームワークへの全面移行は行わない
- 性能ベンチマーク値を断定しない
- 流行語の暗記ではなく、要件に対する選定理由を中心にする
