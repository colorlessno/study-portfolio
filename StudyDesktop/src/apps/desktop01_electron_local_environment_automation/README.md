# desktop01 Electron ローカル環境自動化

## 目的

Electron の main / renderer / IPC 境界、コマンド allowlist、mock setup task、cancel、workspace cleanup を学ぶ。

初期MVPでは、実際の `git clone` や実プロジェクトへの依存インストールは行わない。安全な mock task のみを扱う。

## コマンド

```cmd
npm run start
npm run plan
npm run mock:clone
npm run mock:venv
npm run mock:install
npm run check:allowlist
```

## workspace

task は `workspace/` 配下だけを操作する。workspace外のファイルを削除、移動、上書きしてはいけない。

## 検証記録

2026-05-07:

- `npm install` 成功。
- Electron を `v42.0.0` へ更新。
- `npm audit --json` は脆弱性0件。
- `npm run check:allowlist` 成功。
- `npm run plan` 成功。
- Electron UI プロセスが6秒間起動状態を維持することを確認し、その後停止。
