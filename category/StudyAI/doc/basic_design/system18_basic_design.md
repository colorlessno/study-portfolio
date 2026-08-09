# System 18 基本設計

## Embedding類似検索ミニ実験

---

## 1. 設計目的

Embedding類似検索ミニ実験は、要件定義で定めた「検索比較」の学習を、StudyAI の共通アプリ構造に組み込める単位へ整理する。本設計では、入力、処理・結果、出力、保存、画面、API、Docker実行方針を定義し、詳細設計と製造へ引き継ぐ。

## 2. 配置方針

```text
category/StudyAI/
  backend/
    src/studyai/systems/system18/
      api/
      schemas/
      services/
      repositories/
  frontend/
    src/pages/System18Page.tsx
  src/scripts/system18_*.py
  backend/tests/systems/system18/
  doc/basic_design/system18_basic_design.md
```

- 既存の `system01` から `system16` は変更しない。
- system別の業務ロジックは `src/backend/src/studyai/systems/system18/` に閉じる。
- 共通化できるAIクライアント、設定、ログ、ファイル保存は `src/backend/src/studyai/common/` を利用する。
- フロントエンドは既存の StudyAI ルーティングに `System18Page` として追加する想定にする。
- フロントエンドの実装ファイルは `src/frontend/src/pages/System18Page.tsx` とする。

## 3. 全体構成

```text
利用者
  ↓ System18Page
  ↓ /api/system18
  ↓ System18Router
  ↓ System18Service
  ↓ Repository / FileStore / MockAIClient
  ↓ JSON結果保存
```

## 4. コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| `System18Router` | API入口、入力バリデーション、レスポンス整形を行う |
| `System18Service` | EmbeddingService がベクトル化し SimilaritySearchService がcosine類似度で順位付けする |
| `System18Repository` | 実験結果、比較結果、評価結果を保存・取得する |
| `System18Page` | 文書登録、質問入力、検索結果一覧 |
| `system18_*` script | CLIまたはローカル検証用の最小実行口を提供する |

## 5. 入出力設計

| 区分 | 内容 |
|---|---|
| 入力 | documents, query_text, top_k |
| 処理 | EmbeddingService がベクトル化し SimilaritySearchService がcosine類似度で順位付けする |
| 出力 | ranked_documents, similarity_score, matched_text |
| 保存 | documents, embeddings, search_runs |

## 6. API設計

| メソッド | パス | 目的 | 備考 |
|---|---|---|---|
| POST | `/api/system18/documents` | Embedding類似検索ミニ実験の実行または参照 | 詳細設計でschemaを定義 |
| POST | `/api/system18/search` | Embedding類似検索ミニ実験の実行または参照 | 詳細設計でschemaを定義 |

- API prefix は `/api/system18` とする。
- 外部AI APIが使えない場合は、モックまたはサンプルデータで同じレスポンス構造を返す。
- 失敗時は `error_code`、`message`、`detail` を返す。

## 7. 画面設計

| 領域 | 内容 |
|---|---|
| 入力領域 | documents, query_text, top_k を入力または選択する |
| 実行領域 | 実行ボタン、設定値、実行状態を表示する |
| 結果領域 | ranked_documents, similarity_score, matched_text を表または比較モードで表示する |
| 学習メモ領域 | 観察結果、判断理由、後続設計へのメモを記録する |

## 8. データ設計

| データ | 主な項目 |
|---|---|
| `system18_runs` | `id`, `input_json`, `config_json`, `result_json`, `created_at` |
| `system18_notes` | `run_id`, `observation`, `decision`, `risk_note` |

- 初期製造ではファイル保存またはインメモリ保存を許容する。
- DBを使う場合は system別テーブル名に `system18_` prefix を付ける。
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
