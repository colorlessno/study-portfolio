# web27_nginx_static_reverse_proxy

Nginxで静的ファイル配信とAPIリバースプロキシを行うサンプルです。

## 構成

- `/`: Nginxが `web/index.html` と `web/style.css` を配信
- `/api/health`: NginxがAPIコンテナへ転送
- `nginx/default.conf`: `root` と `proxy_pass` の設定

`location /api/` では `proxy_pass http://api:3000/;` としているため、ブラウザの `/api/health` はAPIコンテナの `/health` に転送されます。

## 起動

```bash
docker compose up --build
```

## 確認

- 静的ページ: `http://localhost:8087`
- API: `http://localhost:8087/api/health`

## ログ確認

```bash
docker compose logs nginx
docker compose logs api
```

APIサービス名やポートを誤るとNginx側で502になります。設定変更後は `docker compose restart nginx` で再読み込みします。HTTPS/TLSは対象外です。
