# security09 ファイルアップロード制御

file nameとsizeのmetadataだけを入力し、extension allowlist、size上限、負数を判定する静的教材です。実fileを選択・送信・保存せず、client-side検証と本番のserver-side検査の差を学びます。画面確認は15分、防御層を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- extension allowlistとsize上限をmetadataへ適用できる
- browser申告MIMEとfile nameだけで安全を保証できないと説明できる
- 受信、内容検査、保存、配信を別の境界として設計できる
- 元file nameをstorage keyへ使わない理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [File upload 要件定義](../../requirements/security09_file_upload_requirements.md) |
| 基本設計 | [File upload 基本設計](../../basic_design/security09_basic_design.md) |
| 詳細設計 | [File upload 詳細設計](../../detailed_design/security09_detailed_design.md) |
| 補足 | [Upload policy](./upload_policy.md) |
| 実装 | [security09 ソース](../../../src/backend/src/studysecurity/systems/security09_file_upload/) |

## 資料を見る前の確認問題

1. file名が`.pdf`なら、内容も必ずPDFでしょうか。
2. browserが送るMIME typeをそのまま信用できないのはなぜですか。
3. uploadしたfileを同じWeb rootから配信すると、どのような危険がありますか。

## 現実装の範囲

- 許可extensionは`.csv`、`.txt`、`.pdf`
- sizeは0以上1MiB以下を許可する
- file nameとsizeを手入力するだけで、実fileは扱わない
- MIME、magic number、malware scan、保存名生成、隔離、配信は文書上の設計観点だけを扱う

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security09_file_upload run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security09_file_upload run start
```

browserで`http://localhost:4109`を開き、次を比較します。

| file name | size | 期待結果 |
|---|---:|---|
| `sample.csv` | 1000 | 許可 |
| `sample.exe` | 1000 | `extension_not_allowed` |
| `sample.pdf` | 1048577 | `size_exceeded` |
| `sample.txt` | -1 | `invalid_size` |

確認後は`Ctrl+C`でserverを停止します。

## コードを読む順番

1. [`upload_policy.md`](./upload_policy.md): 本番で必要な防御層を先に確認する
2. [`index.html`](../../../src/backend/src/studysecurity/systems/security09_file_upload/public/index.html): 現実装がmetadata入力だけであることを見る
3. [`app.js`](../../../src/backend/src/studysecurity/systems/security09_file_upload/public/app.js): extension正規化、allowlist、size判定を追う
4. [`server.js`](../../../src/backend/src/studysecurity/systems/security09_file_upload/app/server.js): 教材配信だけを行うことを確認する

## 観察ポイント

- uppercase extensionも小文字へ正規化して比較する
- extensionがなくてもallowlist外として拒否する
- `Number.isFinite`、負数、上限超過を分けて判定する
- 画面上の`accepted`はmetadata条件だけの結果で、安全なfileという意味ではない
- client-side JavaScriptは利用者が変更できるため、server-side検証の代替にならない

## 安全な改造課題

1. file name末尾の空白や複数extensionをどう扱うか、期待結果を先に決める。
2. server-side APIを追加する前提で、受信前後のsize制限を設計する。
3. generated storage key、original display name、download response headerの役割を分ける。
4. 検査前fileと許可済みfileの保存領域を分離する構成を描く。

## 自分の言葉で説明する

- metadata検証だけで内容の安全性を保証できない理由
- client、API gateway、application、scanner、storageで行う検査の違い
- upload fileをWeb rootへ直接置かない理由

## 学習用実装の制約

- 実file input、multipart request、server保存を実装しない
- MIME、内容、malwareを検査しない
- 画面はallowlistとsizeの入口だけを観察する

## 学習完了の目安

- レベル1（再現）: 許可、extension拒否、size超過、負数を確認できる
- レベル2（説明）: metadataと内容検査、保存、配信の境界を説明できる
- レベル3（改造）: 本番upload pipelineの検査順と失敗時処理を設計できる

security05〜09を終えたら、入力がAPI、SQL、Cookie付きrequest、DOM、file metadataの各境界でどう扱われるかを比較します。
