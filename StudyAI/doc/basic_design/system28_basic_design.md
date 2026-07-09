# System 28 基本設計

## OCR結果の正規化

---

## 1. 設計目的

OCR結果の正規化は、要件定義で定めた「データ品質」の学習を、StudyAI の共通アプリ構造に組み込める単位へ整理する。本設計では、入力、処理・結果、出力、保存、画面、API、Docker実行方針を定義し、詳細設計と製造へ引き継ぐ。

## 2. 配置方針

```text
StudyAI/
  backend/
    src/studyai/systems/system28/
      api/
      schemas/
      services/
      repositories/
  frontend/
    src/pages/System28Page.tsx
  src/scripts/system28_*.py
  backend/tests/systems/system28/
  doc/basic_design/system28_basic_design.md
```

- 既存の `system01` から `system16` は変更しない。
- system別の業務ロジックは `src/backend/src/studyai/systems/system28/` に閉じる。
- 共通化できるAIクライアント、設定、ログ、ファイル保存は `src/backend/src/studyai/common/` を利用する。
- フロントエンドは既存の StudyAI ルーティングに `System28Page` として追加する想定にする。
- フロントエンドの実装ファイルは `src/frontend/src/pages/System28Page.tsx` とする。

## 3. 全体構成

```text
利用者
  ↓ System28Page
  ↓ /api/system28
  ↓ System28Router
  ↓ System28Service
  ↓ Repository / FileStore / MockAIClient
  ↓ JSON結果保存
```

## 4. コンポーネント設計

| コンポーネント | 役割 |
|---|---|
| `System28Router` | API入口、入力バリデーション、レスポンス整形を行う |
| `System28Service` | OcrNormalizeService が表記・空白・誤認識候補を正規化する |
| `System28Repository` | 実験結果、比較結果、評価結果を保存・取得する |
| `System28Page` | OCRテキスト、差分表示、確認対象一覧 |
| `system28_*` script | CLIまたはローカル検証用の最小実行口を提供する |

## 5. 入出力設計

| 区分 | 内容 |
|---|---|
| 入力 | ocr_text, normalization_rules, correction_dictionary |
| 処理 | OcrNormalizeService が表記・空白・誤認識候補を正規化する |
| 出力 | normalized_text, diff_items, review_flags |
| 保存 | normalization_runs |

## 6. API設計

| メソッド | パス | 目的 | 備考 |
|---|---|---|---|
| POST | `/api/system28/normalize` | OCR結果の正規化の実行または参照 | 詳細設計でschemaを定義 |

- API prefix は `/api/system28` とする。
- 外部AI APIが使えない場合は、モックまたはサンプルデータで同じレスポンス構造を返す。
- 失敗時は `error_code`、`message`、`detail` を返す。

## 7. 画面設計

| 領域 | 内容 |
|---|---|
| 入力領域 | ocr_text, normalization_rules, correction_dictionary を入力または選択する |
| 実行領域 | 実行ボタン、設定値、実行状態を表示する |
| 結果領域 | normalized_text, diff_items, review_flags を表または比較モードで表示する |
| 学習メモ領域 | 観察結果、判断理由、後続設計へのメモを記録する |

## 8. データ設計

| データ | 主な項目 |
|---|---|
| `system28_runs` | `id`, `input_json`, `config_json`, `result_json`, `created_at` |
| `system28_notes` | `run_id`, `observation`, `decision`, `risk_note` |

- 初期製造ではファイル保存またはインメモリ保存を許容する。
- DBを使う場合は system別テーブル名に `system28_` prefix を付ける。
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
