# web28 環境変数による設定切替

Docker Compose、Vite、Node.jsで環境変数を受け渡し、公開可能な設定とバックエンド専用設定を分けるテーマです。

## このテーマでできるようになること

- `.env.example`とローカル`.env`の役割を区別できる
- Composeの必須値・既定値構文を説明できる
- ViteでBrowserへ公開される変数を判断できる
- 起動時に必須環境変数とPORTを検証できる

## 関連資料

1. [要件定義](../../requirements/web28_env_config_requirements.md)
2. [基本設計](../../basic_design/web28_basic_design.md)
3. [詳細設計](../../detailed_design/web28_detailed_design.md)
4. [Compose構成](../../../src/infra/compose/web28_env_config/docker-compose.yml)
5. [環境変数例](../../../src/infra/env/web28_env_config/.env.example)
6. [Backend実装](../../../src/backend/src/studyweb/systems/web28_env_config/backend/server.js)

## 資料を見る前の確認問題

- `VITE_`付き変数を秘密情報に使ってはいけない理由は何ですか。
- Composeの`${NAME:?message}`と`${NAME:-default}`は何が違いますか。
- `.env.example`へ本物のパスワードを書いてよいでしょうか。

## 15分で再開する

1. backend単体テストで必須値、port範囲、responseへの公開範囲を確認する。
2. `.env.example`を指定してComposeを起動する。
3. Webと`/config-check`を開く。
4. Browserへ見える値と見えない値を分ける。
5. APP_MESSAGEを別値にして再起動し、反映を確認する。

```powershell
npm.cmd --prefix StudyWeb/src/backend/src/studyweb/systems/web28_env_config/backend test
```

テストはephemeral portを使い、DockerやDB接続なしで実行できます。

## 起動方法

`StudyWeb/src/infra/compose/web28_env_config`で、サンプル環境変数ファイルを明示して実行します。

```bash
docker compose --env-file ../../env/web28_env_config/.env.example up --build
```

| 対象 | URL |
|---|---|
| Web | `http://localhost:5188` |
| API health | `http://localhost:13028/health` |
| 設定確認 | `http://localhost:13028/config-check` |

## 設定項目

| 変数 | 利用場所 | Browserへ値が見えるか |
|---|---|---|
| `FRONTEND_PORT` | Composeのport公開 | 接続先として分かる |
| `API_PORT` | Composeのport公開 | 接続先として分かる |
| `API_INTERNAL_PORT` | backendとCompose | config-checkに数値が出る |
| `VITE_API_URL` | frontend bundle | 見える |
| `DATABASE_URL` | backend | 値そのものは返さない |
| `APP_MESSAGE` | backend | config-checkへ表示する |

BackendはDATABASE_URLの有無だけを`hasDatabaseUrl`として返し、接続文字列自体は返しません。現サンプルはDBへ実際には接続しません。

## 観察ポイント

- 必須のFRONTEND_PORT、API_PORT、VITE_API_URL、DATABASE_URLがないとComposeが停止するか
- API_INTERNAL_PORTとAPP_MESSAGEは既定値を持つか
- VITE_API_URLが画面とBrowser bundleへ公開されるか
- DATABASE_URLの内容がAPIレスポンスに出ないか
- PORTが1〜65535の整数でない場合にbackendが終了するか

## 壊して直す演習

1. `--env-file`を外して起動し、必須変数エラーを読む。
2. API_INTERNAL_PORTを不正な文字列へ変え、backendの起動検証を見る。
3. VITE_API_URLのポートを誤らせ、Browserの接続エラーを見る。
4. APP_MESSAGEだけを変更し、コード変更なしで表示が変わることを確認する。

## 自分の言葉で説明する

- Build時にBrowserへ埋め込む値と、backendだけが持つ値を説明してください。
- `.env`と`.env.example`の公開範囲をどう分けますか。
- DATABASE_URLを値ではなくbooleanだけ返す理由は何ですか。

## うまく動かないとき

- Compose開始前に失敗する場合は、必須変数と`--env-file`の相対パスを確認します。
- frontendだけAPIへ接続できない場合は、VITE_API_URLとAPI_PORTを照合します。
- backendが終了する場合は、missing envとInvalid PORTのログを確認します。

## 学習完了の目安

- [ ] sample envでWebとAPIを起動した
- [ ] backend単体テストが成功した
- [ ] 必須値不足と不正PORTを観察した
- [ ] VITE公開値とbackend専用値を分類した
- [ ] APP_MESSAGEを環境変数だけで切り替えた
