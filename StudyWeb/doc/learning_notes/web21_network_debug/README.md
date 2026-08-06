# web21 Networkデバッグ

React画面から200、400、404、500のAPIを呼び、DevTools NetworkでURL、status、response body、接続エラーを比較するテーマです。

## このテーマでできるようになること

- Networkから通信失敗の段階を判断できる
- HTTPエラーとnetwork errorを区別できる
- Request URL、Status、Responseを使って原因を絞り込める
- `fetch`がHTTPエラーでもresponseを返すことを説明できる

## 関連資料

1. [要件定義](../../requirements/web21_network_debug_requirements.md)
2. [基本設計](../../basic_design/web21_basic_design.md)
3. [詳細設計](../../detailed_design/web21_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web21_network_debug/docker-compose.yml)
5. [React App](../../../src/frontend/src/studyweb/systems/web21_network_debug/frontend/src/App.tsx)
6. [DebugController](../../../src/backend/src/studyweb/systems/web21_network_debug/backend/src/debug.controller.ts)

## 資料を見る前の確認問題

- HTTP 500と、サーバーへ接続できない状態は何が違いますか。
- `fetch`のcatchへ入るのは、HTTP 400を受け取ったときでしょうか。
- Response bodyから調査に使える情報は何ですか。

## 15分で再開する

1. Composeを起動してDevTools Networkを開く。
2. 200、400、404、500ボタンを順に押す。
3. 各通信のHeadersとResponseを比較する。
4. backendを停止し、network_errorを確認する。

## 起動方法

`StudyWeb/src/infra/compose/web21_network_debug`で実行します。

```bash
docker compose up --build
```

| 対象 | URL |
|---|---|
| Frontend | `http://localhost:5181` |
| API例 | `http://localhost:13021/debug/success` |

## コードを読む順番

1. backend Controllerで4パスと例外を見る。
2. React Appの`endpoints`配列を見る。
3. `callApi`でfetch、JSON変換、status表示を見る。
4. catchがnetwork errorだけを扱うことを確認する。
5. Composeの公開ポートとCORSを見る。

## 比較表

| 操作 | Network status | Promiseの流れ | 画面 |
|---|---:|---|---|
| 200 | 200 | responseをJSON化 | statusとbody |
| 400 | 400 | responseをJSON化 | statusとbody |
| 404 | 404 | responseをJSON化 | statusとbody |
| 500 | 500 | responseをJSON化 | statusとbody |
| API停止 | statusなし | catch | `network_error` |

## 壊して直す演習

1. `docker compose stop backend`後に全ボタンを押し、HTTP responseがないことを確認する。
2. `VITE_API_URL`のポートを誤らせ、Request URLとエラーを見る。
3. `/debug/success`へqueryを追加し、NestJSのルーティング結果を見る。
4. JSONではないレスポンスを想定し、`response.json()`が失敗する場合を考える。

## 自分の言葉で説明する

- HTTPエラーとnetwork errorをNetwork表示でどう見分けますか。
- 400や500でcatchへ入らない理由は何ですか。
- 調査時にRequest URLを最初に確認する利点は何ですか。

## うまく動かないとき

- ボタンが通信を出さない場合は、Consoleとclick処理を確認します。
- すべてnetwork_errorなら、backend状態と13021番を確認します。
- statusはあるが画面更新に失敗する場合は、ResponseがJSONか確認します。

## 学習完了の目安

- [ ] 200、400、404、500をNetworkで比較した
- [ ] API停止時のnetwork errorを確認した
- [ ] Request URL、Status、Responseを使って調査した
- [ ] HTTPエラーでfetchがrejectされないことを説明した
