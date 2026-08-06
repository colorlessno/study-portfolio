# 表示方式比較表

## 比較前の分類

| 分類 | 対象 | 比較する問い |
|---|---|---|
| page delivery / rendering | MPA、SPA、SSR、SSG | HTMLをいつ・どこで生成し、page遷移で何を取得するか |
| component / hydration | Server Components、Islands | UIとdata処理をserver / clientへどう分割するか |
| application capability | PWA | offline、install、push、background syncを加えるか |

分類をまたいだ組合せが可能であり、すべてを排他的な1択として比較しない。

## Page delivery / rendering

| 方式 | HTML / dataの基本形 | 強み | 主な注意点 | 向く例 |
|---|---|---|---|---|
| MPA | navigationごとにserverからpage全体を取得 | 単純なdata flow、server validation | page遷移、serverとの密結合 | internal CRUD、content site |
| SPA | static shell後、browserがAPIとstateを管理 | rich interaction、client内遷移 | initial loading、bundle、auth / error state | dashboard、editor、tool |
| SSR | request時にserverで初期HTMLを生成 | request時dataを含む初期HTML | server負荷、fetch waterfall、cache boundary | dynamic public page、private page |
| SSG | build時等にHTMLを生成し配信 | CDN配信、安定したpublic content | freshness、build / regeneration設計 | docs、marketing、catalog |

MPAはnavigationの形、SSR / SSGはHTML生成時点、SPAはclient runtime中心という性質があり、frameworkによって境界は混ざり得る。

## Component / hydration strategy

| 戦略 | 基本形 | 強み | 主な注意点 |
|---|---|---|---|
| Server Components | data-heavy componentをserverで処理し、必要なclient componentと組み合わせる | client JavaScript削減、server data access | server / client境界、framework制約、cache理解 |
| Islands | static HTMLを基本にinteractive islandだけhydrateする | content中心pageのJavaScript削減 | island間state、private app全体への適合性 |

## PWA capability

PWAはMPA / SPA / SSR / SSG等へ追加できるcapability群。

| Capability | 価値 | Risk |
|---|---|---|
| service worker cache | offline・再訪高速化 | stale content、cache invalidation |
| installability | app風導線 | platform差 |
| background sync | offline操作の後送 | 重複送信・競合 |
| push | 再訪通知 | permission・運用・privacy |

## 判断原則

- product要件、data ownership、cache boundaryを先に決める
- 「初回表示が速い」等を測定なしで断定しない
- security、observability、deploy、障害時運用も比較する
- 1方式ですべてを統一せず、route・pageごとの構成も検討する
