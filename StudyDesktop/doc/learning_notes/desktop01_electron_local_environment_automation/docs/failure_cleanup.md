# 失敗時cleanup

## cleanup境界

cleanup対象は以下に限定する。
```text
src/apps/desktop01_electron_local_environment_automation/workspace/
```

このdirectory外のファイルを削除してはいけない。
## cleanup mode

| mode | 動作 | 用途 |
| --- | --- | --- |
| Preview | 対象一覧のみ表示 | 学習時の初期値 |
| Run scoped cleanup | 1つのrun directoryだけ削除 | 後続拡張 |
| Reset workspace | 生成された run directory を削除 | 確認付きの後続拡張 |

## 失敗時方針
taskが失敗したら:

1. run log を保持する。
2. 生成物を incomplete として扱う。
3. 失敗したstepを明示する。
4. 自動retryしない。
5. cleanupまたはrerunにはuser操作を要求する。
失敗を隠すのではなく、証拠と境界を理解する教材にする。
