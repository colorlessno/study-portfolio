# web28_env_config

`.env` を使ってAPI URL、DB接続先、ポート番号を切り替えるサンプルです。

## 起動

`.env.example` を `.env` にコピーしてから起動します。

```bash
docker compose up --build
```

## 設定項目

| 変数 | 使う場所 | 内容 |
|---|---|---|
| `FRONTEND_PORT` | compose | ブラウザから開くWebポート |
| `API_PORT` | compose | ブラウザから接続するAPIポート |
| `API_INTERNAL_PORT` | backend/compose | コンテナ内APIポート |
| `VITE_API_URL` | frontend | フロントから呼ぶAPI URL |
| `DATABASE_URL` | backend | DB接続文字列の例 |
| `APP_MESSAGE` | backend | 設定反映を確認する表示値 |

Viteではブラウザに公開する環境変数に `VITE_` prefix が必要です。`DATABASE_URL` のようなバックエンド専用値をフロントに渡さないようにします。

## 確認

- Web: `http://localhost:5188`
- API: `http://localhost:13028/config-check`

`.env` はローカル設定用で、秘密情報を含む可能性があるためGit管理対象外にします。`.env.example` にはダミー値だけを書きます。
