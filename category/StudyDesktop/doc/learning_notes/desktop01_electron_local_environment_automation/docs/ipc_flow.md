# IPCの流れ

## processごとの責務

| process | 責務 | してはいけないこと |
| --- | --- | --- |
| renderer | task表示、実行依頼、log表示 | command文字列を組み立てる |
| preload | 小さな `desktop01` API を公開する | Node.jsを直接公開する |
| main | task allowlist、process起動、出力streamを管理する | rendererから渡されたcommand引数を信頼する |
| script | 1つの限定されたmock処理を行う | workspace外へ書き込む |

## 流れ

1. renderer が `desktop01.listTasks()` を呼ぶ。
2. main が allowlist から task ID と表示情報を返す。
3. renderer が `desktop01.runTask(taskId)` を呼ぶ。
4. main が `commandAllowlist.js` からcommandを解決する。
5. main が `workspace/` 配下にrun directoryを作る。
6. main が stdout/stderr event を renderer へ送る。
7. main が exit code と duration を含む最終statusを記録する。

## 確認観点

重要なのは、rendererがcommand lineを送らないこと。rendererは「意図」だけを送り、信頼できる側のmainが固定commandへ変換する。
