# web19 ReactからAPIを呼んで一覧表示

Reactの`fetch`からNestJS APIを呼び、loading、error、successの状態を切り替えて一覧表示するテーマです。

## このテーマでできるようになること

- Reactの初期表示時にGET APIを呼べる
- 非同期処理をloading、error、successへ分けられる
- CORSが必要になる構成を説明できる
- DevTools NetworkでフロントとAPIの通信を追える

## 関連資料

1. [要件定義](../../requirements/web19_fetch_task_list_requirements.md)
2. [基本設計](../../basic_design/web19_basic_design.md)
3. [詳細設計](../../detailed_design/web19_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web19_fetch_task_list/docker-compose.yml)
5. [React App](../../../src/frontend/src/studyweb/systems/web19_fetch_task_list/frontend/src/App.tsx)
6. [API Controller](../../../src/backend/src/studyweb/systems/web19_fetch_task_list/backend/src/tasks.controller.ts)

## 資料を見る前の確認問題

- ブラウザから別ポートのAPIを呼ぶと、なぜCORSが関係しますか。
- `fetch`はHTTP 404や500で自動的にrejectされますか。
- loadingをfalseへ戻す処理は、成功時と失敗時のどちらにも必要ですか。

## 15分で再開する

1. Composeでfrontendとbackendを起動する。
2. 画面とNetworkの`GET /tasks`を確認する。
3. backendを停止し、再読み込みしてerror表示を見る。
4. backendを再開し、successへ戻ることを確認する。

## 起動方法

`category/StudyWeb/src/infra/compose/web19_fetch_task_list`で実行します。

```bash
docker compose up --build
```

| 対象 | URL |
|---|---|
| Frontend | `http://localhost:5179` |
| API | `http://localhost:13019/tasks` |

## コードを読む順番

1. Composeで公開ポートと`VITE_API_URL`を見る。
2. backendの`main.ts`でCORS有効化を見る。
3. `tasks.controller.ts`で固定3件を見る。
4. React Appで3つのstateと`useEffect`を見る。
5. response.ok、JSON変換、catch、finallyを順に追う。

## 状態遷移

```text
初期: loading=true
  ↓ fetch
成功: tasksを保存 → loading=false → 一覧
失敗: errorを保存 → loading=false → エラー表示
```

## 壊して直す演習

1. backendを`docker compose stop backend`で停止し、接続エラーを見る。
2. `VITE_API_URL`のポートを誤らせ、Request URLを確認する。
3. backendの`app.enableCors()`を一時的に外し、ブラウザのCORSエラーを見る。
4. response.okの確認を外し、HTTPエラーとJSON処理の関係を考える。

## 自分の言葉で説明する

- Browser、frontend、backendの3者と2つの公開ポートを説明してください。
- Promise chainのthen、catch、finallyの役割は何ですか。
- CORSエラーとAPI停止のnetwork errorをどう見分けますか。

## うまく動かないとき

- 画面が開かない場合は`docker compose ps`とfrontendログを確認します。
- API単体が失敗する場合は13019番とbackendログを確認します。
- ブラウザだけ失敗する場合はConsoleのCORSとNetworkのRequest URLを確認します。

## 学習完了の目安

- [ ] loading、success、errorを確認した
- [ ] Network上のGETとresponse bodyを確認した
- [ ] API停止とCORSの違いを説明できた
- [ ] 終了後にComposeを停止した
