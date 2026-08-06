# web52 現代Web表示方式の比較

StudyWebのcapstoneとして、同じ画面要件をMPA、SPA、SSR、SSG等へ当てはめ、流行や好みではなくdata freshness、auth、cache、interactivity、運用条件から構成を選ぶ文書完結型テーマ。

## 最初に押さえる前提

ここで扱う用語は、すべてが同じ軸の排他的な選択肢ではない。

| 分類 | 例 | 主な問い |
|---|---|---|
| page delivery / rendering | MPA、SPA、SSR、SSG | HTMLをいつ・どこで作るか |
| component / hydration strategy | Server Components、Islands | serverとclientへUI責務をどう分けるか |
| application capability | PWA | offline、install、push、background syncが必要か |

たとえばSSRにServer Componentsを組み合わせたり、SSG pageの一部をislandとしてhydrateしたり、SPAをPWA対応したりできる。「7方式から1つだけ選ぶ」問題ではない。

## このテーマで身につけること

- HTML生成時点、data取得場所、hydration範囲を分けて説明する
- public / private cacheの境界をauth要件から判断する
- initial display、freshness、interactivity、運用complexityのtrade-offを示す
- StudyWebで学んだHTTP、routing、API、auth、performanceを構成選定へつなげる

## 15分で再開する

このテーマには実行アプリがない。次の順で文書を読み、scenarioを1つ選んでdecision memoを書く。

1. [表示方式比較表](docs/rendering_mode_matrix.md)で用語の軸を確認する
2. [一覧画面での比較](docs/list_screen_comparison.md)で同じ画面へ適用する
3. [API / cache / auth / hydration](docs/api_cache_auth_relation.md)でdata boundaryを見る
4. [StudyWeb対応表](docs/studyweb_mapping.md)から復習themeを選ぶ
5. [選定scenario](docs/selection_scenarios.md)で判断を言語化する

## Decision memo template

```text
対象画面:
利用者と認証:
SEO / share要件:
data更新頻度:
必要なinteractivity:
offline要件:
選んだ構成:
server / clientの責務:
cache boundary:
採用しなかった案と理由:
運用上のrisk:
```

## 手を動かす

- public docs、認証dashboard、offline field tool、simple internal CRUDの4scenarioを比較する
- 同じ注文一覧をMPA、SPA、SSRの3案でdata flow図にする
- private dataをpublic CDN cacheへ置かない構成を説明する
- JavaScriptを無効にした初期HTMLと、hydrate後の操作範囲を考える
- 既存themeを3つ選び、構成判断に必要な知識として関連付ける

## よくある誤解

- SSRなら常に速い、SPAなら常に操作性が高いとは限らない
- SSGはbuild時生成だけでなく、frameworkによって再生成戦略を組み合わせられる
- Server Componentsはpage delivery方式全体を単独で置き換える名称ではない
- Islandsは「JavaScriptなし」ではなく、必要部分だけをhydrateする考え方である
- PWAはrendering方式ではなく、複数方式へ追加できるcapability群である
- framework名から選ばず、data ownershipとcache boundaryを先に決める

## 自分の言葉で説明する

- MPA / SPAとSSR / SSGが完全に同じ比較軸ではないのはなぜか
- public contentとprivate dashboardでcache設計が違うのはなぜか
- hydrationを減らす利点と、client操作への制約は何か
- 選定理由に運用・障害調査・deploy頻度を含めるべきなのはなぜか

## 完了条件

- MPA、SPA、SSR、SSGをHTML生成とdata取得の観点で説明できる
- Server Components、Islands、PWAを組合せ可能な別軸として説明できる
- 2つ以上のscenarioでdecision memoを書いた
- 採用案だけでなく、不採用案とtrade-offを説明できる
- StudyWebの既存themeを構成判断へ3つ以上関連付けた
