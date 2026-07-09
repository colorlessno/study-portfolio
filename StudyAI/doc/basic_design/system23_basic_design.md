# System 23 基本設計

## Reranker比較

---

## 1. 設計目的

Reranker比較は、要件定義で定めた「検索改善」の学習を、StudyAI の共通アプリ構造に組み込める単位へ整理する。本設計では、入力、処理・結果、出力、保存、画面、API、Docker実行方針を定義し、詳細設計と製造へ引き継ぐ。

## 2. 配置方針

```text
StudyAI/
  backend/
    src/studyai/systems/system23/
      api/
      schemas/
      services/
      repositories/
  frontend/
    src/pages/System23Page.tsx
  src/scripts/system23_*.py
  backend/tests/systems/system23/
  doc/basic_design/system23_basic_design.md
```

- 既存の `system01` から `system16` は変更しない。
- system別の業務ロジックは `src/backend/src/studyai/systems/system23/` に閉じる。
- 共通化できるAIクライアント、設定、ログ、ファイル保存は `src/backend/src/studyai/common/` を利用する。
- フロントエンドは既存の StudyAI ルーティングに `System23Page` として追加する想定にする。
- フロントエンドの実装ファイルは `src/frontend/src/pages/System23Page.tsx` とする。

## 3. 全体構成

```text
利用者
  ↓ System23Page
  ↓ /api/system23
  ↓ System23Router
  ↓ System23Service
  ↓ Repository / FileStore / MockAIClient
  ↓ JSON結果保存
```

## 4. コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| `System23Router` | API入口、入力バリデーション、レスポンス整形を行う |
| `System23Service` | RetrievalService の初期順位を RerankService が再順位付けする |
| `System23Repository` | 実験結果、比較結果、評価結果を保存・取得する |
| `System23Page` | 初期順位とrerank後順位の比較 |
| `system23_*` script | CLIまたはローカル検証用の最小実行口を提供する |

## 5. 入出力設計

| 区分 | 内容 |
|---|---|
| 入力 | query, candidate_documents, initial_top_k, rerank_top_k |
| 処理 | RetrievalService の初期順位を RerankService が再順位付けする |
| 出力 | before_ranking, after_ranking, latency_summary |
| 保存 | rerank_runs |

## 6. API設計

| メソッド | パス | 目的 | 備考 |
|---|---|---|---|
| POST | `/api/system23/rerank` | Reranker比較の実行または参照 | 詳細設計でschemaを定義 |

- API prefix は `/api/system23` とする。
- 外部AI APIが使えない場合は、モックまたはサンプルデータで同じレスポンス構造を返す。
- 失敗時は `error_code`、`message`、`detail` を返す。

## 7. 画面設計

| 領域 | 内容 |
|---|---|
| 入力領域 | query, candidate_documents, initial_top_k, rerank_top_k を入力または選択する |
| 実行領域 | 実行ボタン、設定値、実行状態を表示する |
| 結果領域 | before_ranking, after_ranking, latency_summary を表または比較モードで表示する |
| 学習メモ領域 | 観察結果、判断理由、後続設計へのメモを記録する |

## 8. データ設計

| データ | 主な項目 |
|---|---|
| `system23_runs` | `id`, `input_json`, `config_json`, `result_json`, `created_at` |
| `system23_notes` | `run_id`, `observation`, `decision`, `risk_note` |

- 初期製造ではファイル保存またはインメモリ保存を許容する。
- DBを使う場合は system別テーブル名に `system23_` prefix を付ける。
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
