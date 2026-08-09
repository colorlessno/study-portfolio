# web49 retry / timeout 詳細設計

## 0. 関連文書

- `../requirements/web49_retry_timeout_requirements.md`
- `../basic_design/web49_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studyweb/systems/web49_retry_timeout/
  Dockerfile
  package.json
  api/src/server.js
doc/learning_notes/web49_retry_timeout/
  README.md
  docs/retry_policy.md
  docs/timeout_check.md
```

## 2. Mode

| mode | Status / 時間 | Body・用途 |
|---|---|---|
| `success` | 200即時 | 正常系 |
| `slow` | 2秒後に200 | client timeout確認 |
| `temporary` | 2回503、3回目200 | retry可能な一時失敗 |
| `permanent` | 400即時 | retry対象外の恒久失敗 |
| その他 | 200 | success扱い |

## 3. 処理手順

1. URL queryからmodeを取得し、未指定ならsuccessとする。
2. slowは2秒のtimer後にresponseする。
3. temporaryはglobal counterを1増やす。
4. temporary counterが3の倍数でなければ503を返す。
5. 3の倍数なら200 recoveredを返す。
6. permanentは400・retryable falseを返す。
7. その他は200 successを返す。

## 4. Retry Clientの方針

serverは失敗patternだけを提供する。呼出側で次を実装する。

- attemptごとのtimeout
- max attemptsと全体timeout
- retry対象status / error
- backoffと必要に応じたjitter
- attempt・待機・最終結果のlog
- 副作用操作のidempotency

## 5. 要件との差分・既知の課題

- retry clientとretry logを実装しない。
- timeoutはserver設定ではなくclient側で指定する。
- temporary counterは全clientで共有する。
- `Retry-After` headerを返さない。
- route・未知modeをvalidationしない。
- circuit breakerや分散traceは対象外。

## 6. 確認手順

1. successの即時200を確認する。
2. slowを1秒timeoutで打ち切る。
3. temporaryを3回呼び、503・503・200を確認する。
4. permanentの400・retryable falseを確認する。
5. max attempts付きclientを作り、retry対象を限定する。

## 7. 完了条件

- timeoutを呼出側で制御できる。
- 一時失敗と恒久失敗を区別できる。
- retry上限・backoffを説明できる。
- 副作用操作に冪等性が必要な理由を説明できる。
