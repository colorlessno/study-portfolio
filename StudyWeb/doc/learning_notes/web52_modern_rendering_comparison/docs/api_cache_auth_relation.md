# API / cache / auth / hydration の関係

## 判断要素

| 要素 | 質問 |
| --- | --- |
| API | browserがAPIを直接呼ぶか、serverがdataを組み立てるか |
| Cache | dataはpublic、shared、private、staleのどれか |
| Auth | meaningful contentをrenderする前にidentityが必要か |
| Hydration | HTML到着後にどれだけclient JavaScriptが必要か |
| Mutation | 画面は主にreadか、頻繁にwriteするか |

## よくあるrisk

- public cache が private data を返す。
- SPA shell が auth解決前に空または誤解を招く状態を見せる。
- SSR page がserver fetchを直列に呼びすぎる。
- server/clientのtimeやlocale差でhydration mismatchが起きる。
- PWA が古いauthenticated stateを返す。

## ルール

表示方式は、data ownership と cache boundary を決めてから選ぶ。
