# 一覧画面での比較

## scenario

認証済みuserが注文一覧を開き、statusでfilterし、詳細画面を開く。

## 比較

| 方式 | request形状 | 強み | risk |
| --- | --- | --- | --- |
| MPA | filterごとにserverへsubmit | 単純で安定 | page全体の遷移が増える |
| SPA | initial shell後にAPI fetch | 操作がなめらか | loading stateとauth errorをclientで扱う必要 |
| SSR | serverが初回一覧をrender | 意味ある初回表示が速い | requestごとのserver負荷 |
| SSG | prebuilt page | public listでは速い | privateで変化が多いdataには不向き |
| Server Components | serverが一覧取得、clientがfilter control | data境界を保ちやすい | framework complexity |
| Islands | static shellにfilter widget | ほぼstaticなpageに有効 | private app全体には不向き |
| PWA | cached shell + sync | offline support | cache invalidationが難しい |

## 判断

認証付きで頻繁に変わる注文一覧なら、SSRまたはserver componentsが有力。画面がtool的でclient stateが中心ならSPAも妥当。
