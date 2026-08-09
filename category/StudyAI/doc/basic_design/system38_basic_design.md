# System 38 基本設計

## リアルタイム推薦・パーソナライズ

## 1. 設計目的

リアルタイム推薦・パーソナライズは、企業AIシステムの「推薦・ランキング」パターンを学習できる教材として設計する。実企業システムそのものを再現するのではなく、業務入力、AI判断、承認、実行、監査、評価の流れを小さく実装できる形へ整理する。

## 2. 配置方針

```text
category/StudyAI/
  src/backend/src/studyai/systems/enterprise_ai/
    catalog.py
    service.py
    router.py
  src/frontend/src/pages/EnterpriseAiSystemPage.tsx
  src/scripts/enterprise_ai_demo.py
  src/scripts/system38_enterprise_demo.py
  backend/tests/systems/test_enterprise_ai_systems.py
```

- 既存の `system01` から `system36` は変更しない。
- `system37` から `system44` は共通の企業AI教材実装を共有し、catalog で system別の差分を管理する。
- LM Studio 本体は Docker 化せず、既存方式と同じくローカル起動し、Docker からは `host.docker.internal` 経由で接続する。
- 初期MVPは外部AIなしのモック・サンプルデータで成立させる。

## 3. 全体構成

```text
利用者
  ↓ EnterpriseAiSystemPage
  ↓ /api/system38
  ↓ EnterpriseAiRouter
  ↓ EnterpriseAiService
  ↓ Catalog / MockDecisionEngine / InMemoryRunStore
```

## 4. 業務フロー

```text
行動ログ取込 -> 特徴量作成 -> 候補生成 -> ランキング -> 表示 -> 反応記録 -> A/B評価
```

## 5. コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| `EnterpriseAiCatalog` | system別のテーマ、入力テンプレート、状態遷移、KPIを管理する |
| `EnterpriseAiService` | 入力を受け取り、業務判断、提案、状態遷移、評価結果を生成する |
| `MockDecisionEngine` | 外部AIなしで候補比較・スコアリング・分類・最適化の疑似結果を返す |
| `EnterpriseAiRouter` | `/api/system38` 配下の API を提供する |
| `EnterpriseAiSystemPage` | 入力、状態、提案、監査ログ、KPIを表示する |

## 6. 入出力設計

| 区分 | 内容 |
|---|---|
| 入力 | ユーザー属性、行動ログ、候補アイテム、実験条件 |
| 出力 | 推薦リスト、スコア、推薦根拠、variant、反応ログ |
| 状態 | logged / ranked / displayed / clicked / converted / evaluated |

## 7. API設計

| メソッド | パス | 目的 |
|---|---|---|
| POST | `/api/system38/events` | リアルタイム推薦・パーソナライズ の操作 |
| GET | `/api/system38/recommendations` | リアルタイム推薦・パーソナライズ の操作 |
| POST | `/api/system38/feedback` | リアルタイム推薦・パーソナライズ の操作 |
| GET | `/api/system38/experiments` | リアルタイム推薦・パーソナライズ の操作 |

- API prefix は `/api/system38` とする。
- response には `run_id`, `state`, `result`, `audit_log`, `kpi_snapshot` を含める。
- エラー時は `error_code`, `message`, `detail`, `trace_id` を返す。

## 8. 画面設計

| 領域 | 内容 |
|---|---|
| 入力領域 | ユーザー属性、行動ログ、候補アイテム、実験条件 をJSONまたはフォームで入力する |
| 状態領域 | `logged / ranked / displayed / clicked / converted / evaluated` の現在状態を表示する |
| 結果領域 | 推薦リスト、スコア、推薦根拠、variant、反応ログ を表、カード、JSONで表示する |
| 監査領域 | 判断理由、承認、却下、エスカレーションを時系列で表示する |
| 評価領域 | 成功率、リスク、コスト、レイテンシなどの教材用KPIを表示する |

## 9. データ設計

| データ | 主な項目 |
|---|---|
| `system38_runs` | `id`, `input_json`, `state`, `result_json`, `created_at` |
| `system38_audit_logs` | `run_id`, `action`, `actor`, `reason`, `created_at` |
| `system38_kpi_snapshots` | `run_id`, `metric_name`, `metric_value`, `unit` |

初期MVPではメモリまたはJSONファイル保存を許容する。DB永続化する場合は `system38_` prefix を使う。

## 10. 非機能・運用設計

- Docker に入れられる実装は StudyAI 既存の `backend` / `frontend` 共通サービスへ統合する。
- Docker build / run を実施しない場合は、製造工程の検証記録へ未実行理由を残す。
- 外部AI APIが使えない場合はモックで同じ response schema を返す。
- 個人情報、秘密情報、決済情報そのものは教材データに含めない。
- 作成・更新するテストファイルは UTF-8 BOMなしで保存する。

## 11. 後続工程への引き継ぎ

詳細設計では、request / response schema、状態遷移表、監査ログ項目、KPI項目、エラーコード、検証コマンドを具体化する。
