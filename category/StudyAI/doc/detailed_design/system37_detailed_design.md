# System 37 詳細設計

## 取引実行型AIコンシェルジュ

---

## 1. 実装配置

```text
backend/src/studyai/systems/enterprise_ai/
  __init__.py
  catalog.py
  service.py
  router.py
frontend/src/pages/EnterpriseAiSystemPage.tsx
scripts/enterprise_ai_demo.py
scripts/system37_enterprise_demo.py
backend/tests/systems/test_enterprise_ai_systems.py
```

- system37 専用の物理ディレクトリは作らず、enterprise_ai 共通実装の catalog 差分として実装する。
- 既存の system01 から system36 の成果物は変更しない。
- LM Studio 本体は Docker 化せずローカル起動とし、Docker コンテナの backend から host.docker.internal の OpenAI互換APIへ接続できる構成を維持する。
- 初期MVPは外部AIが未起動でも動作するよう、決定ロジックは deterministic mock とサンプルデータで成立させる。
- 作成・更新するテキストファイルは UTF-8 BOMなしで保存する。

## 2. catalog 定義

catalog.py に system37 の設定を追加する。

| 項目 | 値 |
|---|---|
| system_id | system37 |
| title | 取引実行型AIコンシェルジュ |
| pattern | 予約・申込・注文 |
| default_input | 希望条件、候補リスト、空き枠、価格、本人確認状況 を含む教材用JSON |
| state_flow | hearing / proposed / confirming / executed / changed / cancelled / escalated |
| kpi_definitions | 成功率、リスク数、コスト、レイテンシ_ms |
| risk_points | 確認なし実行、実顧客データ混入、業務ロジックの誤適用 |

default_input は秘密情報、個人情報、実決済情報を含めない。実企業システムそのものを再現するのではなく、業務判断、AI判断、承認、監査、評価の学習に必要な最小データへ限定する。

## 3. API 詳細

### 3.1 GET /api/system37/metadata

response:

```json
{
  "system_id": "system37",
  "title": "取引実行型AIコンシェルジュ",
  "pattern": "予約・申込・注文",
  "default_input": {},
  "state_flow": [],
  "kpi_definitions": [],
  "risk_points": []
}
```

### 3.2 POST /api/system37/execute

request:

```json
{
  "input": {},
  "mode": "mock",
  "operator": "learner"
}
```

response:

```json
{
  "run_id": "uuid",
  "system_id": "system37",
  "state": "string",
  "result": {},
  "audit_log": [],
  "kpi_snapshot": {},
  "created_at": "ISO-8601"
}
```

### 3.3 GET /api/system37/runs

response:

```json
{
  "runs": []
}
```

- /api/system37 は router.py の factory で生成し、StudyAI の main router へ登録する。
- ルート追加時は system37 から system44 をまとめて登録し、漏れがないことをテストで確認する。

## 4. request schema

| フィールド | 型 | 必須 | 内容 |
|---|---|---|---|
| input | object | yes | system別の教材入力。主項目は 希望条件、候補リスト、空き枠、価格、本人確認状況 |
| mode | string | no | mock または lmstudio。初期値は mock |
| operator | string | no | 操作者。監査ログの actor に入れる |

validation:

- input がobject でない場合は 400 を返す。
- mode=lmstudio の場合でも、LM Studio 未接続時は mock へ明示的に fallback し、監査ログに記録する。
- 教材用途のため、API key、password、token、実カード番号に相当するキーが入力された場合は保存せず、mask する。

## 5. response / result schema

| フィールド | 型 | 内容 |
|---|---|---|
| run_id | string | 実行単位ID |
| system_id | string | system37 |
| state | string | hearing / proposed / confirming / executed / changed / cancelled / escalated のいずれか |
| result.summary | string | 判断概要 |
| result.recommendations | array | 推奨、候補、検知、最適化案など |
| result.explanations | array | 判断理由 |
| result.risk_flags | array | 確認なし実行、実顧客データ混入、業務ロジックの誤適用 に基づく注意点 |
| audit_log | array | 入力受付、判断、fallback、完了の証跡 |
| kpi_snapshot | object | 成功率、リスク数、コスト、レイテンシ_ms を含むKPI |

## 6. 状態遷移

| from | event | to | 監査ログ |
|---|---|---|---|
| start | request accepted | hearing | request_received |
| hearing | mock decision completed | proposed | decision_generated |
| proposed | risk found | confirming | risk_flagged |
| proposed | no blocking risk | executed | execution_completed |
| any | LM Studio unavailable | current state | lmstudio_fallback_to_mock |

system37 の状態候補は hearing / proposed / confirming / executed / changed / cancelled / escalated とし、画面では現在状態、次状態、終了状態を表示する。

## 7. サービス処理

EnterpriseAiService.execute(system_id, payload) の処理内容:

1. catalog.py から system37 の定義を取得する。
2. request をvalidate し、秘密情報に見える値をmask する。
3. mode=lmstudio かつ接続情報がある場合は OpenAI互換API呼び出し候補を作る。
4. LM Studio が利用できない場合は mock decision engine を使う。
5. 予約・申込・注文 の教材観点に沿って result, audit_log, kpi_snapshot を生成する。
6. in-memory run store に直近実行を保存する。
7. response schema に整形して返す。

## 8. 監査ログ

| 項目 | 型 | 内容 |
|---|---|---|
| timestamp | string | ISO-8601 |
| run_id | string | 実行単位ID |
| system_id | string | system37 |
| actor | string | operator または system |
| action | string | request_received, decision_generated, risk_flagged, execution_completed など |
| reason | string | 判断理由 |
| input_hash | string | 入力JSONの簡易ハッシュ |

監査ログには raw input 全文を保存しない。学習目的で必要な場合も、mask 済みの要約のみを表示する。

## 9. KPI

| KPI | 内容 |
|---|---|
| 成功率 / リスク数 / コスト / レイテンシ_ms | system37 の主要KPI |
| risk_flag_count | risk flags の件数 |
| mock_fallback_count | mock fallback の発生数 |
| latency_ms | 処理時間の教材用値 |

KPI は初期MVPでは疑似値を返す。製造工程では固定入力に対して値が安定することをテストする。

## 10. エラー設計

| error_code | HTTP | 条件 |
|---|---|---|
| system37_not_found | 404 | catalog に system定義がない |
| system37_input_invalid | 400 | input がobject ではない |
| system37_unsafe_input_masked | 200 | 秘密情報相当の入力を mask して続行した |
| system37_execution_failed | 500 | 想定外例外 |

error response:

```json
{
  "error_code": "system37_input_invalid",
  "message": "input must be an object",
  "detail": {},
  "trace_id": "uuid"
}
```

## 11. Docker / LM Studio 接続

- backend / frontend / test は StudyAI 既存のDocker 構成に入れる。
- LM Studio 本体はローカルアプリとして起動し、Docker からは host.docker.internal 経由で接続する。
- .env.docker では既存方式に合わせて LM_STUDIO_BASE_URL=http://host.docker.internal:5858/v1 を使う。
- LM Studio 未起動でもmode=mock で API、画面、テストが成立することを必須条件とする。

## 12. 製造時の検証コマンド

```powershell
$env:PYTEST_DISABLE_PLUGIN_AUTOLOAD='1'; python -m pytest .\src\backend\tests\systems\test_enterprise_ai_systems.py -q
python .\src\scripts\system37_enterprise_demo.py
npm.cmd --prefix .\src\frontend run build
docker compose -f .\docker-compose.yml build backend frontend
```

Docker build / run を実行できない場合は、製造工程の検証記録へ未実行理由と代替検証を残す。

## 13. 製造タスク

- catalog.py に system37 定義を追加する。
- service.py に企業AI共通の mock decision engine・mask・KPI生成・audit生成を実装する。
- router.py で /api/system37/metadata, /api/system37/execute, /api/system37/runs を公開する。
- EnterpriseAiSystemPage.tsx で入力、状態、結果、監査ログ、KPIを表示する。
- src/scripts/system37_enterprise_demo.py を追加する。
- test_enterprise_ai_systems.py で metadata / execute / runs / fallback / mask を確認する。
