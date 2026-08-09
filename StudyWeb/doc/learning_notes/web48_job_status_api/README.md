# web48 job status API

時間のかかる処理を同期responseで待たせず、job受付と状態確認へ分ける Node.js API。202でjob IDを返し、queued → running → succeededを別requestで観察する。

## このテーマで身につけること

- job受付APIとjob状態取得APIの責務を分ける
- HTTP 202 Acceptedと200成功結果の違いを説明する
- pollingを終端状態・回数上限・間隔付きで設計する
- job ID、状態、結果、失敗理由のdata modelを考える

## 10分で再開する

前提は Node.js 20 以上。依存パッケージはなく、`npm install`は不要。

```powershell
cd StudyWeb\src\backend\src\studyweb\systems\web48_job_status_api
npm.cmd test
npm.cmd start
```

自動テストはtimerを待たずにqueued → running → succeededを進め、202、200、404を確認する。APIは`http://localhost:3048`。終了は`Ctrl+C`、構文確認は`npm.cmd run build`。

## 最初に試す順番

別のPowerShellでjobを作成する。

```powershell
$job = Invoke-RestMethod -Method Post -Uri http://localhost:3048/jobs
$job
Invoke-RestMethod -Uri "http://localhost:3048/jobs/$($job.id)"
Start-Sleep -Milliseconds 400
Invoke-RestMethod -Uri "http://localhost:3048/jobs/$($job.id)"
Start-Sleep -Milliseconds 600
Invoke-RestMethod -Uri "http://localhost:3048/jobs/$($job.id)"
```

queued、running、succeededと`result=done`を確認する。状態定義は [Job State](docs/job_state.md)、polling設計は [Polling Flow](docs/polling_flow.md) を参照する。

## コードを読む順番

1. `jobs` Mapでjobをメモリ管理する構成を見る
2. `POST /jobs`で`randomUUID()`によるID生成とqueued保存を見る
3. 300ms・900ms後の`setTimeout`で状態が変わる箇所を見る
4. 202 responseが完了結果ではなく受付結果であることを確認する
5. `GET /jobs/:id`のroute抽出と200 / 404判定を見る

## 現在の状態遷移

```text
POST /jobs
  -> queued
  -> 300ms後 running
  -> 900ms後 succeeded + result
```

## 現実装の範囲

- jobは実処理をせず、timerで状態を変更する
- failed状態・失敗理由は要件にあるが未実装
- job IDは`randomUUID()`由来だが、外部公開時の推測耐性・保持期間・参照権限は別途設計が必要
- jobとtimerはプロセス内だけで、再起動すると消える
- worker、queue、永続化、cancel、進捗率、期限切れはない
- polling clientは付属せず、APIだけを提供する

## 壊して確かめる

- 存在しないjob IDを取得し、404を確認する
- 特定条件でfailedとerror messageへ遷移するtimerを追加する
- job IDへ所有者を関連付け、他userのjobを取得できないようにする
- `progress`を0 / 50 / 100として返す
- polling側に最大回数、間隔、終端状態での停止を追加する
- サーバー再起動中のjobをどう扱うか設計する

## 自分の言葉で説明する

- なぜjob作成時に完了結果ではなく202を返すのか
- queuedとrunningは利用者・運用者に何を伝えるか
- pollingを無制限・高頻度にしてはいけない理由は何か
- failed responseに利用者向け理由と開発者向け情報をどう分けるか

## 完了条件

- 202とjob IDを確認した
- 自動テストで状態遷移とunknown jobを確認した
- queued → running → succeededを確認した
- unknown jobの404を確認した
- failedまたはpolling上限制御を1つ以上追加した
