# System 36 基本設計

## Trace保存

---

## 1. 設計目的

Trace保存は、要件定義で定めた「観測性」の学習を、StudyAI の共通アプリ構造に組み込める単位へ整理する。本設計では、入力、処理・結果、出力、保存、画面、API、Docker実行方針を定義し、詳細設計と製造へ引き継ぐ。

## 2. 配置方針

```text
category/StudyAI/
  backend/
    src/studyai/systems/system36/
      api/
      schemas/
      services/
      repositories/
  frontend/
    src/pages/System36Page.tsx
  src/scripts/system36_*.py
  backend/tests/systems/system36/
  doc/basic_design/system36_basic_design.md
```

- 既存の `system01` から `system16` は変更しない。
- system別の業務ロジックは `src/backend/src/studyai/systems/system36/` に閉じる。
- 共通化できるAIクライアント、設定、ログ、ファイル保存は `src/backend/src/studyai/common/` を利用する。
- フロントエンドは既存の StudyAI ルーティングに `System36Page` として追加する想定にする。
- フロントエンドの実装ファイルは `src/frontend/src/pages/System36Page.tsx` とする。

## 3. 全体構成

```text
利用者
  ↓ System36Page
  ↓ /api/system36
  ↓ System36Router
  ↓ System36Service
  ↓ Repository / FileStore / MockAIClient
  ↓ JSON結果保存
```

## 4. コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| `System36Router` | API入口、入力バリデーション、レスポンス整形を行う |
| `System36Service` | TraceService がtrace_id単位で処理過程を保存し、後から検索可能にする |
| `System36Repository` | 実験結果、比較結果、評価結果を保存・取得する |
| `System36Page` | trace一覧、詳細、検索条件 |
| `system36_*` script | CLIまたはローカル検証用の最小実行口を提供する |

## 5. 入出力設計

| 区分 | 内容 |
|---|---|
| 入力 | user_input, retrieved_context, model_config, prompt, output, evaluation |
| 処理 | TraceService がtrace_id単位で処理過程を保存し、後から検索可能にする |
| 出力 | trace_record, trace_list, replay_note |
| 保存 | ai_traces |

## 6. API設計

| メソッド | パス | 目的 | 備考 |
|---|---|---|---|
| POST | `/api/system36/traces` | Trace保存の実行または参照 | 詳細設計でschemaを定義 |
| GET | `/api/system36/traces` | Trace保存の実行または参照 | 詳細設計でschemaを定義 |

- API prefix は `/api/system36` とする。
- 外部AI APIが使えない場合は、モックまたはサンプルデータで同じレスポンス構造を返す。
- 失敗時は `error_code`、`message`、`detail` を返す。

## 7. 画面設計

| 領域 | 内容 |
|---|---|
| 入力領域 | user_input, retrieved_context, model_config, prompt, output, evaluation を入力または選択する |
| 実行領域 | 実行ボタン、設定値、実行状態を表示する |
| 結果領域 | trace_record, trace_list, replay_note を表または比較モードで表示する |
| 学習メモ領域 | 観察結果、判断理由、後続設計へのメモを記録する |

## 8. データ設計

| データ | 主な項目 |
|---|---|
| `system36_runs` | `id`, `input_json`, `config_json`, `result_json`, `created_at` |
| `system36_notes` | `run_id`, `observation`, `decision`, `risk_note` |

- 初期製造ではファイル保存またはインメモリ保存を許容する。
- DBを使う場合は system別テーブル名に `system36_` prefix を付ける。
- 個人情報・機密情報を扱う可能性がある入力の保存前にマスク方針を確認する。

## 9. Docker・ローカル実行方針

- StudyAI 既存の `docker-compose.yml` に統合できる構造を優先する。
- 小さいCLI検証だけで完結する場合も、製造工程で Docker 実行口を検討する。
- Docker build / run を実施しない場合は、検証記録に未実行理由を残す。
- 作成・更新するテストファイルは UTF-8 BOMなしで保存する。

## 10. 後続工程への引き継ぎ

詳細設計では、次を具体化する。

- request / response schema
- 保存形式またはテーブル定義
- モックAIと実AIを切り替える設定
- エラーコード
- Docker 実行方針
- 検証コマンド
