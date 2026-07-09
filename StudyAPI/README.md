# StudyAPI

Python 標準ライブラリ（`http.server`）のみで実装した、最小構成の Web API サンプルです。OpenAI 互換のローカル LLM サーバ（LM Studio 等）へのリクエストを中継する、学習用の小さなスクリプトです。

## 構成

```text
StudyAPI/
  src/
    simple_web_api.py
```

## 使い方

```bash
python src/simple_web_api.py
```

設定はファイルを編集せず、環境変数で上書きできます。

| 環境変数 | 既定値 | 説明 |
|---|---|---|
| `WEB_API_HOST` | `127.0.0.1` | バインドするホスト |
| `WEB_API_PORT` | `9898` | ポート番号 |
| `LMSTUDIO_BASE_URL` | `http://127.0.0.1:5858` | 中継先の LLM サーバ |

## 本リポジトリについて

- 個人の学習用に作成している実験的なプロジェクトです。
- 開発・整理には Claude Code / Codex などの AI コーディングアシストを活用しています。
- 学習目的のため、各テーマの粒度や完成度には差があります。
