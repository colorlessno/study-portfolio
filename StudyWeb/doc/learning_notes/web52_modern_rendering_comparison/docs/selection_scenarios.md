# 選定scenario

## scenario A: public documentation

推奨: SSG または islands。

理由: contentの変化が遅く、public cacheが安全で、JavaScriptが必要なのは小さなwidgetだけだから。

## scenario B: authenticated dashboard

推奨: SSR、server components、またはSPA。

理由: dataがprivateで頻繁に変わる。初回表示のdata ownershipをserverへ寄せるならSSR/server components、tool的な操作が中心ならSPA。

## scenario C: offline field tool

推奨: PWA。

理由: installability、cache、background sync が初回request renderingより重要だから。

## scenario D: simple internal CRUD

推奨: MPA または SSR。

理由: 予測しやすいserver validationと低いclient complexityが、rich client stateより価値を持つことが多い。
