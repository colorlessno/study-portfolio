# StudyWeb対応表

| Theme | 既存学習 | web52で使う判断 |
|---|---|---|
| web01〜06 | browser、path、DOM、form | HTML・asset・submitの基本 |
| web07〜12 | React、state、component、UI | client interactivityとcomponent境界 |
| web13〜18 | API、error、Prisma、relation | server data accessとvalidation |
| web19〜22 | fetch、mutation、Network、query cache | SPA / full-stackのloading・cache |
| web23 | Next.js pages / layout | routeとlayoutのserver構成 |
| web24 | Server Component fetch | server data取得とclient JS削減 |
| web25 | Form Action | mutationをserverへ寄せる判断 |
| web26〜28 | Compose、Nginx、env | deploy・runtime・proxy・設定 |
| web32 | HTTP headers | cache・request / response観察 |
| web33 | Cookie / Session | SSR / MPA / APIのprivate data |
| web34 | CORS | browserから別origin APIを呼ぶ境界 |
| web35・41 | status・error response | 表示方式に依存しない失敗処理 |
| web36 | localStorage | client保存とsecurity risk |
| web38〜40 | routing、fallback、table | rich client UIの必要度 |
| web42 | pagination API | 一覧画面のdata取得・cache |
| web43 | idempotency | retry可能なmutation |
| web46・47 | file input | client / server validation境界 |
| web48・49 | job、polling、retry / timeout | 長時間処理とfailure設計 |
| web50・51 | N+1、index | server rendering時も残るDB性能問題 |

## web52の役割

web01〜51は個別部品・失敗patternを学ぶ。web52は次の順でそれらを構成判断へ接続する。

```text
user flow
  -> data ownership
  -> auth / cache boundary
  -> HTML生成とrouting
  -> hydration / interactivity
  -> runtime / operations
  -> performance・failure検証
```

判断に迷った場合は、表の対応themeへ戻って動作を再確認する。
