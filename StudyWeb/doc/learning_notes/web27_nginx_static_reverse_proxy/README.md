# web27 Nginx静的配信とAPIリバースプロキシ

NginxからHTML・CSSを配信し、同じoriginの`/api/`だけを別コンテナのNode.js APIへ転送するテーマです。

## このテーマでできるようになること

- 静的ファイル配信とリバースプロキシを同じNginxで設定できる
- BrowserへAPIの内部service名を公開せずに通信できる
- `proxy_pass`末尾スラッシュによるパス変換を説明できる
- 404、502、静的ファイル404をログから区別できる

## 関連資料

1. [要件定義](../../requirements/web27_nginx_static_reverse_proxy_requirements.md)
2. [基本設計](../../basic_design/web27_basic_design.md)
3. [詳細設計](../../detailed_design/web27_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web27_nginx_static_reverse_proxy/docker-compose.yml)
5. [Nginx設定](../../../src/infra/nginx/web27_nginx_static_reverse_proxy/nginx/default.conf)
6. [API実装](../../../src/backend/src/studyweb/systems/web27_nginx_static_reverse_proxy/api/server.js)

## 資料を見る前の確認問題

- リバースプロキシはBrowserとAPIの間で何を担当しますか。
- `/api/health`をAPIの`/health`へ変えるのはどの設定ですか。
- APIが停止した場合、Nginxはどのstatusを返すでしょうか。

## 15分で再開する

1. Composeを起動する。
2. `http://localhost:8087`を開く。
3. ボタンを押して`/api/health`を確認する。
4. NetworkのRequest URLとNginx設定を対応付ける。

## 起動方法

`StudyWeb/src/infra/compose/web27_nginx_static_reverse_proxy`で実行します。

```bash
docker compose up --build
```

| 対象 | URL |
|---|---|
| 静的ページ | `http://localhost:8087` |
| Proxy経由API | `http://localhost:8087/api/health` |

## リクエストの流れ

```text
Browser /api/health
  ↓ localhost:8087
Nginx location /api/
  ↓ proxy_pass http://api:3000/
API GET /health
```

`proxy_pass`のURL末尾に`/`があるため、locationに一致した`/api/`部分を置き換えて`/health`を転送します。

## 観察ポイント

- HTMLとCSSがNginxから200で配信されるか
- Browserが`api:3000`ではなく`localhost:8087/api/health`だけを呼ぶか
- APIレスポンスが`web27-api`を含むか
- 同一origin通信のためBrowser側CORS設定が不要か
- API停止時にNginxが502を返すか

## 壊して直す演習

1. APIを停止し、ボタンとNginxログで502を確認する。
2. `proxy_pass`のservice名を誤らせ、名前解決・接続エラーを見る。
3. `location /api/`と末尾スラッシュの組合せを変えた場合の転送パスを予想する。
4. 存在しない静的ファイルと存在しないAPIパスを呼び、応答元を比較する。

## 自分の言葉で説明する

- 静的配信とAPI Proxyの流れを説明してください。
- Nginxを挟むとBrowser側のURLが単純になる理由は何ですか。
- 404と502をどのログで切り分けますか。

## うまく動かないとき

- 画面自体が開かない場合はnginx serviceと8087番を確認します。
- APIだけ失敗する場合は`docker compose logs nginx`と`logs api`を比較します。
- 設定変更後はnginxを再起動し、読み込まれた設定を確認します。

## 学習完了の目安

- [ ] 静的ページとProxy APIを同じoriginで確認した
- [ ] `/api/health`から`/health`への変換を説明できた
- [ ] API停止時の502を観察した
- [ ] NginxとAPIのログを使い分けた
