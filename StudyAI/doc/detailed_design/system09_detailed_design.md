# System 09 詳細設計
## 市場競合調査 エージェント

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/research.py
├── schemas/research.py
├── services/research_planner.py
├── services/query_generator.py
├── services/source_evaluator.py
├── services/report_composer.py
├── services/export_service.py
├── repositories/report_repository.py
└── prompts/research_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| ResearchRouter | 調査 API 入口 | `start_research()`, `list_reports()`, `get_report()`, `export_report()` |
| ResearchPlanner | 調査観点整理 | `build_research_plan()` |
| QueryGenerator | 検索クエリ生成 | `generate_queries()` |
| SourceEvaluator | 採否・重複排除 | `filter_sources()` |
| ReportComposer | レポート整形 | `compose_report()` |
| ExportService | Markdown 出力 | `export_markdown()` |

## 3. API 詳細

### 3.1 POST `/research`
- 入力: 調査テーマ、対象企業群、観点、期間
- 処理:
  1. 調査計画立案
  2. クエリ生成
  3. 情報取得
  4. ソース採否判定
  5. レポート生成
- 応答: `report_id`, `executive_summary`, `comparison_table`, `swot`

### 3.2 GET `/reports`
- フィルタ: `research_type`, `target_company`, `from_date`, `to_date`

### 3.3 GET `/reports/{report_id}` / GET `/reports/{report_id}/export`
- 詳細は出典一覧、主要発見、企業比較、SWOT を返す
- export は Markdown 形式固定

## 4. 詳細API I/O 定義

### 4.1 POST `/research`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `topic` | string | ○ | 調査テーマ |
| `target_companies` | string[] |  | 対象企業 |
| `focus_points` | string[] |  | 比較観点 |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `report_id` | integer | レポートID |
| `status` | string | queued / running / completed |
| `summary` | string | 調査概要 |

### 4.2 GET `/reports` / GET `/reports/{report_id}` / GET `/reports/{report_id}/export`

| 項目 | 型 | 説明 |
|---|---|---|
| `from_date` / `to_date` | string(date) | 一覧絞り込み |
| `report_id` | integer | 詳細対象 |
| `report` | object | 概要、比較表、示唆 |
| `format` | string | markdown / csv |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /research` | `topic` | 必須 |
| `POST /research` | `target_companies`,`focus_points` | 配列形式 |
| `GET /reports` | 期間条件 | 前後関係を確認 |
| `GET /reports/{report_id}/export` | 出力形式 | 許可形式のみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `invalid_topic` | 400 | テーマ不正 |
| `report_not_found` | 404 | レポート不存在 |
| `export_failed` | 500 | 出力失敗 |
| `research_source_unavailable` | 503 | 参照元取得失敗 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `report.sections` | 必須セクションを持つ | 再生成 |
| `comparison_items[]` | 1件以上 | 再生成 |
| `confidence` | 0.0〜1.0 またはラベル許可値 | 422 を返す |

## 8. データベース詳細

### 8.1 `reports`
- `research_type`, `targets`, `key_findings`, `companies`, `comparison_table`, `swot`, `markdown`, `created_at`

### 8.2 補助保持
- `sources_json`: 出典 URL と採用理由
- `query_log_json`: 発行クエリと取得件数

## 9. AI 処理詳細

- 出力は「要約」「比較」「出典」の 3 層に分ける
- 出典のない主張は禁止
- 類似情報は企業単位・論点単位でまとめる

## 10. エラー・品質設計

- 情報不足時は `insufficient_sources` を返す
- 同一ドメインの重複出典は 1 件に集約する
- 取得失敗したクエリはレポート末尾に未取得として記録する

## 11. DDL

### 11.1 `reports`

```sql
CREATE TABLE reports (
    id               SERIAL PRIMARY KEY,
    research_type    VARCHAR(50) NOT NULL,
    theme            VARCHAR(255) NOT NULL,
    targets          JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_findings     JSONB NOT NULL DEFAULT '[]'::jsonb,
    companies        JSONB NOT NULL DEFAULT '[]'::jsonb,
    comparison_table JSONB NOT NULL DEFAULT '[]'::jsonb,
    swot             JSONB NOT NULL DEFAULT '{}'::jsonb,
    markdown         TEXT,
    sources_json     JSONB NOT NULL DEFAULT '[]'::jsonb,
    query_log_json   JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_research_type ON reports(research_type);
CREATE INDEX idx_reports_created_at    ON reports(created_at DESC);
```

