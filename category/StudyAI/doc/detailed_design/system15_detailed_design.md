# System 15 詳細設計
## 電子書籍 セクション別自動要約システム

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/jobs.py
├── schemas/job.py
├── services/capture_adapter.py
├── services/page_preprocessor.py
├── services/ocr_fusion_service.py
├── services/structure_analyzer.py
├── services/visual_analyzer.py
├── services/summary_generator.py
├── services/artifact_manager.py
├── repositories/job_repository.py
└── prompts/section_summary_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| JobRouter | 要約ジョブ API | `create_job()`, `get_job()`, `get_sections()`, `get_artifacts()` |
| CaptureAdapter | PDF/画像/リーダー画面取込 | `capture_input()` |
| PagePreprocessor | 画像前処理 | `preprocess_page()` |
| OCRFusionService | OCR 統合 | `run_ocr()`, `merge_ocr_results()` |
| StructureAnalyzer | 章節境界推定 | `detect_toc()`, `build_sections()` |
| VisualAnalyzer | 図表解析 | `analyze_visuals()` |
| SummaryGenerator | セクション要約 | `generate_section_summary()` |
| ArtifactManager | 中間成果物保存 | `save_artifact()` |

## 3. API 詳細

- `POST /jobs`
  - 非同期受付
  - 入力: PDF、画像群、対象範囲
- `GET /jobs/{job_id}`
- `GET /jobs/{job_id}/sections`
- `GET /jobs/{job_id}/artifacts`

## 4. 詳細API I/O 定義

### 4.1 POST `/jobs`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `input_type` | string | ○ | pdf / image_dir / capture |
| `input_path` | string | ○ | 入力元パス |
| `max_pages` | integer |  | 上限ページ |
| `resume` | boolean |  | 再開実行 |
| `enable_visual_extraction` | boolean |  | 図表解析有効化 |
| `output_formats` | string[] |  | markdown / json |

**レスポンス項目**

| 項目 | 型 | 説明 |
|---|---|---|
| `job_id` | string | ジョブID |
| `status` | string | queued |

### 4.2 GET `/jobs/{job_id}`

| 項目 | 型 | 説明 |
|---|---|---|
| `job_id` | string | ジョブ識別子 |
| `status` | string | running / completed / failed |
| `current_phase` | string | 実行中フェーズ |
| `processed_pages` / `total_pages` | integer | 進捗 |

### 4.3 GET `/jobs/{job_id}/sections`

| 項目 | 型 | 説明 |
|---|---|---|
| `sections[]` | object[] | `section_no`, `title`, `page_from`, `page_to`, `summary_text`, `review_required` |

### 4.4 GET `/jobs/{job_id}/artifacts`

| 項目 | 型 | 説明 |
|---|---|---|
| `artifacts[]` | object[] | OCR結果、図表一覧、構造JSON、最終要約 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /jobs` | `input_type`,`input_path` | 必須 |
| `POST /jobs` | `max_pages` | 1以上 |
| `POST /jobs` | `output_formats[]` | 許可形式のみ |
| `GET /jobs/{job_id}` 系 | `job_id` | 既存ジョブのみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `input_not_found` | 404 | 入力パス不存在 |
| `unsupported_book_format` | 400 | 非対応形式 |
| `ocr_failed` | 500 | OCR失敗 |
| `structure_detection_failed` | 500 | 節構造確定失敗 |
| `artifact_not_found` | 404 | 成果物不存在 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `input_type` | `pdf/image_dir/capture` のみ | 400 を返す |
| `status` | 許可状態のみ | 422 を返す |
| `page_from/page_to` | `page_from <= page_to` | 再計算 |
| `confidence_score` | 0.0〜1.0 | 再計算 |

## 8. データベース詳細

### 8.1 `summarization_jobs`
- `job_id`, `input_type`, `input_path`, `status`, `current_phase`, `total_pages`, `processed_pages`, `output_dir`, `completed_at`

### 8.2 `pages`
- `job_id`, `page_no`, `image_path`, `ocr_text_path`, `ocr_confidence`, `toc_candidate`, `phase_status`

### 8.3 `sections`
- `job_id`, `section_no`, `title`, `page_from`, `page_to`, `summary_text`, `confidence_score`, `review_required`

### 8.4 `visuals`
- `job_id`, `section_id`, `page_no`, `bbox`, `caption`, `description`, `image_path`

## 9. AI 処理詳細

- OCR は VLM と Tesseract の統合結果を採用する
- 要約は本文と図表説明を合わせて生成する
- 根拠セクション外の内容は要約に混ぜない

## 10. ジョブ状態設計

- `queued -> preprocessing -> ocr -> structuring -> summarizing -> completed`
- フェーズ失敗時は `failed_phase` を記録する
- `artifacts` ではページ画像、OCR 結果、節構造 JSON、要約 Markdown を返す

## 11. DDL

### 11.1 `summarization_jobs`

```sql
CREATE TABLE summarization_jobs (
    job_id         VARCHAR(50) PRIMARY KEY,
    input_type     VARCHAR(20) NOT NULL,
    input_path     TEXT,
    status         VARCHAR(20) NOT NULL,
    current_phase  VARCHAR(30),
    total_pages    INTEGER,
    processed_pages INTEGER NOT NULL DEFAULT 0,
    output_dir     TEXT,
    failed_phase   VARCHAR(30),
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at   TIMESTAMP,
    CONSTRAINT chk_summarization_jobs_status
        CHECK (status IN ('queued', 'preprocessing', 'ocr', 'structuring', 'summarizing', 'completed', 'failed'))
);

CREATE INDEX idx_summarization_jobs_created_at ON summarization_jobs(created_at DESC);
```

### 11.2 `pages`

```sql
CREATE TABLE pages (
    id             SERIAL PRIMARY KEY,
    job_id         VARCHAR(50) NOT NULL REFERENCES summarization_jobs(job_id) ON DELETE CASCADE,
    page_no        INTEGER NOT NULL,
    image_path     TEXT,
    ocr_text_path  TEXT,
    toc_candidate  VARCHAR(255),
    ocr_confidence NUMERIC(4,3),
    phase_status   VARCHAR(30),
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, page_no)
);

CREATE INDEX idx_pages_job_id ON pages(job_id);
```

### 11.3 `sections`

```sql
CREATE TABLE sections (
    id            SERIAL PRIMARY KEY,
    job_id        VARCHAR(50) NOT NULL REFERENCES summarization_jobs(job_id) ON DELETE CASCADE,
    section_no    INTEGER NOT NULL,
    title         VARCHAR(255) NOT NULL,
    page_from     INTEGER,
    page_to       INTEGER,
    summary_text  TEXT,
    confidence_score NUMERIC(4,3),
    review_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (job_id, section_no)
);

CREATE INDEX idx_sections_job_id ON sections(job_id);
```

### 11.4 `visuals`

```sql
CREATE TABLE visuals (
    id          SERIAL PRIMARY KEY,
    job_id      VARCHAR(50) NOT NULL REFERENCES summarization_jobs(job_id) ON DELETE CASCADE,
    section_id  INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    page_no     INTEGER,
    bbox        JSONB NOT NULL DEFAULT '{}'::jsonb,
    caption     TEXT,
    description TEXT,
    image_path  TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visuals_job_id      ON visuals(job_id);
CREATE INDEX idx_visuals_section_id ON visuals(section_id);
```

