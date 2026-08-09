# desktop01 Electron ローカル環境自動化

## 目的
デスクトップアプリからローカル環境構築を案内するときに、UIへ任意コマンド実行権限を渡さない設計を学ぶ。
MVPは mock task に限定する。実際の clone / install / build を入れる前に、desktop境界、task選択、進捗log、cleanup、失敗処理を確認する。
## 学習順
1. `docs/ipc_flow.md` を読み、main / preload / renderer の責務を確認する。
2. `docs/command_allowlist.md` を読み、renderer入力がshell commandにならないことを確認する。
3. アプリのディレクトリで `npm run verify` を実行し、安全境界を自動検証する。
4. アプリまたは script から mock plan task を実行する。
5. デスクトップ環境が使える場合はElectron UIを起動する。
6. `docs/state_transition.md` と task log を比較する。
7. 実setup taskを追加する前に `docs/failure_cleanup.md` を確認する。

## 再開用チェックポイント

```cmd
cd StudyDesktop\src\apps\desktop01_electron_local_environment_automation
npm run verify
```

- GUIなしでもallowlist、mock書き込み先、cleanup境界、task状態遷移を確認できる。
- GUI確認へ進むときだけ `npm ci` と `npm run start` を実行する。
- 失敗時はアプリREADMEの「失敗時の復旧」に戻り、workspace外を操作しない。
## ファイル

| ファイル | 目的 |
| --- | --- |
| `src/apps/desktop01_electron_local_environment_automation/` | Electron MVP |
| `src/apps/desktop01_electron_local_environment_automation/test/` | GUIなし安全境界テスト |
| `docs/ipc_flow.md` | main/preload/renderer 境界 |
| `docs/command_allowlist.md` | 許可taskモデル |
| `docs/state_transition.md` | task状態モデル |
| `docs/failure_cleanup.md` | cleanupと失敗時方針 |
| `docs/command_log_example.md` | audit log例 |

## 完了条件

- renderer は task ID だけを送る。
- main process が allowlist から command と args を選ぶ。
- task output は status、開始時刻、終了時刻、exit code、workspace path と一緒に記録する。
- cleanup は app workspace 配下に限定する。
