# 表示方式比較表

| 方式 | 初回表示 | data freshness | interactivity | server要件 | 向いている用途 |
| --- | --- | --- | --- | --- | --- |
| MPA | serverがpage全体を返す | requestごとに高い | page単位 | 従来型server | admin画面、単純CRUD |
| SPA | static shell後にAPI fetch | API次第 | 高い | shell後はAPI中心 | rich tool、dashboard |
| SSR | serverが初期HTMLをrender | requestごとに高い | clientでhydrate | Web server | 認証付きdynamic page |
| SSG | build時にHTML生成 | build時またはrevalidate | 任意 | CDN向き | docs、marketing、catalog |
| Server Components | serverがdata-heavy componentを担当 | server-rendered部分は高い | client islandで補う | framework server | dataとUIが混ざる複雑画面 |
| Islands | static pageにinteractive部品を載せる | island側のdata次第 | 部分的 | 任意 | content page + widget |
| PWA | app shell + offline機能 | sync次第 | 高い | service worker | offlineやinstall風workflow |

## 確認点

表示方式はfrontendの好みだけでなく、productとoperationsの判断でもある。
