# 選定scenario

推奨は唯一の正解ではない。制約を明記し、採用案・不採用案・trade-offを説明する。

## Scenario A: public documentation

| 条件 | 内容 |
|---|---|
| Auth | 不要 |
| Freshness | 低頻度更新 |
| SEO / share | 重要 |
| Interaction | 検索・小さなwidget |

候補: SSGを基本に、必要部分だけIslandsまたはclient componentを追加する。更新頻度やbuild時間によってSSR / regenerationも候補。

## Scenario B: authenticated dashboard

| 条件 | 内容 |
|---|---|
| Auth | 必須・private data |
| Freshness | 高い |
| SEO | 不要 |
| Interaction | filter、mutation、realtime更新 |

候補: SSR / Server Componentsで初期dataをserverへ寄せる案、SPAでtool操作をclient中心にする案。private responseをshared cacheへ置かない。

## Scenario C: offline field tool

| 条件 | 内容 |
|---|---|
| Network | 不安定・offlineあり |
| Mutation | 現場入力を後で同期 |
| Device | install風導線が有効 |

候補: base rendering方式にPWA capabilityを追加する。local queue、再送の冪等性、競合、古いmaster dataを設計する。

## Scenario D: simple internal CRUD

| 条件 | 内容 |
|---|---|
| Auth | 社内利用 |
| SEO | 不要 |
| Interaction | 単純form・一覧 |
| Team | client complexityを抑えたい |

候補: MPAまたはSSR。rich client stateが明確な価値を持つ場合だけSPA化を検討する。

## 自分で判断するScenario E

次のtemplateを埋める。

```text
対象:
利用者:
public / private data:
freshness:
SEO / share:
interaction:
offline:
team / operations制約:

採用構成:
data取得場所:
cache boundary:
hydration範囲:
PWA capability:
不採用案:
最大のtrade-off:
検証方法:
```
