# web22 TanStack QueryによるAPI取得

TanStack Queryの`useQuery`を使い、APIデータ、loading、error、再取得を宣言的に扱うテーマです。

## このテーマでできるようになること

- QueryClientProviderをアプリへ設定できる
- queryKeyとqueryFnの役割を説明できる
- 初回loadingと再取得中を分けて表示できる
- 手書きfetch stateとの違いを比較できる

## 関連資料

1. [要件定義](../../requirements/web22_tanstack_query_requirements.md)
2. [基本設計](../../basic_design/web22_basic_design.md)
3. [詳細設計](../../detailed_design/web22_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web22_tanstack_query/docker-compose.yml)
5. [React App](../../../src/frontend/src/studyweb/systems/web22_tanstack_query/frontend/src/App.tsx)
6. [API関数](../../../src/frontend/src/studyweb/systems/web22_tanstack_query/frontend/src/api/tasks.ts)

## 資料を見る前の確認問題

- API取得結果を複数コンポーネントで共有する場合、何を共通化したいですか。
- 初回読込と、表示済みデータの再取得はUI上どう違いますか。
- queryKeyはキャッシュに対してどんな役割を持ちますか。

## 15分で再開する

1. Composeを起動する。
2. 初回の「読み込み中」と一覧を確認する。
3. 再取得ボタンを押し、2件目の数字が変わることを見る。
4. `main.tsx → App.tsx → api/tasks.ts`の順に読む。

## 起動方法

`StudyWeb/src/infra/compose/web22_tanstack_query`で実行します。

```bash
docker compose up --build
```

| 対象 | URL |
|---|---|
| Frontend | `http://localhost:5182` |
| API | `http://localhost:13022/tasks` |

## コードを読む順番

1. `main.tsx`でQueryClient生成とProviderを見る。
2. `api/tasks.ts`でTask型、API URL、response.okを見る。
3. `App.tsx`でqueryKeyとqueryFnを見る。
4. isLoading、isFetching、isError、dataの表示条件を見る。
5. backendのrequestCountでrefetch確認方法を見る。

## 状態と表示

| 状態 | 条件 | 表示 |
|---|---|---|
| 初回取得 | `isLoading` | `読み込み中です。` |
| 再取得 | `isFetching && !isLoading` | `再取得中です。` |
| 失敗 | `isError` | Error message |
| 成功 | `data`あり | Task一覧 |

開発時はReact StrictModeにより初期処理が複数回観察される場合があります。backendの`requestCount`はプロセス内の値なので、backend再起動で0へ戻ります。

## 壊して直す演習

1. QueryClientProviderを一時的に外し、Provider必須のエラーを見る。
2. queryKeyを別名へ変え、キャッシュ識別子の意味を考える。
3. backendを停止して再取得し、isError表示を確認する。
4. `response.ok`確認を外し、HTTPエラー処理の必要性を考える。

## 自分の言葉で説明する

- QueryClient、QueryClientProvider、useQueryの関係を説明してください。
- isLoadingとisFetchingを分ける理由は何ですか。
- web19の手書きstateとTanStack Query版の違いは何ですか。

## うまく動かないとき

- Providerエラーでは`main.tsx`のラップ構造を確認します。
- 再取得しても数字が変わらない場合は、Networkとbackendプロセスを確認します。
- API失敗時は13022番、CORS、`VITE_API_URL`を確認します。

## 学習完了の目安

- [ ] 初回loading、success、refetch、errorを確認した
- [ ] queryKeyとqueryFnを説明できた
- [ ] StrictModeによる複数通信の可能性を確認した
- [ ] web19とのstate管理の違いを説明した
