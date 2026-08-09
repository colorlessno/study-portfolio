# System 10 詳細設計
## 構成管理補助・ドキュメント所在検索システム

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/scan.py
├── api/routes/search.py
├── api/routes/report.py
├── schemas/scan.py
├── services/mcp_filesystem_client.py
├── services/file_metadata_collector.py
├── services/text_extractor.py
├── services/indexing_service.py
├── services/structure_map_builder.py
├── services/duplicate_detector.py
├── repositories/file_index_repository.py
└── prompts/file_summary_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| ScanRouter | スキャン起動 | `scan_folder()` |
| SearchRouter | 検索 API | `search_documents()` |
| ReportRouter | 構成マップ、重複、レポート | `get_map()`, `get_report()`, `get_duplicates()` |
| MCPFilesystemClient | 対象フォルダ列挙 | `list_files()` |
| IndexingService | embedding 生成と索引更新 | `index_files()` |
| StructureMapBuilder | フォルダ構造可視化 | `build_map()` |
| DuplicateDetector | 重複候補抽出 | `find_duplicates()` |

## 3. API 詳細

- `POST /scan`
  - 入力: `target_paths[]`, `scan_mode`
  - 処理: ファイル収集、本文抽出、summary/embedding 生成、索引更新
- `GET /search`
  - 条件: `query`, `search_mode`, `path_prefix`, `latest_only`
- `GET /map`
  - 応答: フォルダ階層、代表ファイル、最新版候補
- `GET /report`
  - 応答: 所在不明ファイル候補、規約外配置、更新停滞ファイル
- `GET /duplicates`
  - 応答: 重複候補グループ
- `GET /scans`
  - 応答: 実行履歴

## 4. 詳細API I/O 定義

### 4.1 POST `/scan`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `target_paths[]` | string[] | ○ | スキャン対象フォルダ |
| `scan_mode` | string | ○ | full / incremental |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `scan_id` | integer | 実行ID |
| `status` | string | queued / running / completed |
| `scanned_count` | integer | 対象件数 |

### 4.2 GET `/search`

| 項目 | 型 | 説明 |
|---|---|---|
| `query` | string | 自然文検索条件 |
| `search_mode` | string | keyword / semantic / hybrid |
| `path_prefix` | string | 対象パス絞り込み |
| `latest_only` | boolean | 最新版のみ |
| `hits[]` | object[] | `path`, `title`, `summary`, `score`, `latest_flag` |

### 4.3 GET `/map` / GET `/report` / GET `/duplicates` / GET `/scans`

| 項目 | 型 | 説明 |
|---|---|---|
| `nodes[]` | object[] | 構成マップノード |
| `report` | object | 所在不明・規約外配置・更新停滞 |
| `duplicate_groups[]` | object[] | 重複候補グループ |
| `scan_logs[]` | object[] | 実行履歴 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /scan` | `target_paths[]` | 1件以上必須 |
| `POST /scan` | `scan_mode` | `full/incremental` のみ |
| `GET /search` | `query` | 空文字不可 |
| `GET /search` | `search_mode` | `keyword/semantic/hybrid` のみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `path_out_of_scope` | 403 | 許可外パス |
| `scan_in_progress` | 409 | 同一対象スキャン実行中 |
| `search_query_empty` | 400 | クエリ空 |
| `index_build_failed` | 500 | 索引更新失敗 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `path` | 重複不可・絶対パス扱い | 400 を返す |
| `latest_only` | boolean のみ | 400 を返す |
| `similarity_score` | 0.0〜1.0 | 再計算 |

## 8. データベース詳細

### 8.1 `file_index`
- `path`, `title`, `category`, `summary`, `latest_flag`, `embedding`, `updated_at`

### 8.2 `scan_logs`
- `target_path`, `scanned_count`, `failed_count`, `started_at`, `finished_at`

### 8.3 `duplicate_groups`
- `group_id`, `representative_path`, `candidate_paths`, `similarity_score`

## 9. AI 処理詳細

- summary は 2〜3 行
- category は固定ラベル
- 自然文検索は query embedding と `file_index.embedding` の類似度で実行する

## 10. 運用設計

- スキャンはフルスキャンと差分スキャンを分ける
- 差分判定は更新時刻とファイルサイズで行う
- 重複検知は path の近さではなく内容類似度優先で判定する

## 11. DDL

### 11.1 `file_index`

```sql
CREATE TABLE file_index (
    id          SERIAL PRIMARY KEY,
    path        TEXT NOT NULL UNIQUE,
    title       VARCHAR(255),
    category    VARCHAR(50),
    summary     TEXT,
    latest_flag BOOLEAN NOT NULL DEFAULT FALSE,
    file_hash   VARCHAR(64),
    embedding   VECTOR(1536),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_file_index_category   ON file_index(category);
CREATE INDEX idx_file_index_latest     ON file_index(latest_flag);
CREATE INDEX idx_file_index_updated_at ON file_index(updated_at DESC);
CREATE INDEX idx_file_index_embedding  ON file_index USING ivfflat (embedding vector_cosine_ops);
```

### 11.2 `scan_logs`

```sql
CREATE TABLE scan_logs (
    id            SERIAL PRIMARY KEY,
    target_path   TEXT NOT NULL,
    scan_mode     VARCHAR(20) NOT NULL,
    scanned_count INTEGER NOT NULL DEFAULT 0,
    failed_count  INTEGER NOT NULL DEFAULT 0,
    started_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    finished_at   TIMESTAMP,
    CONSTRAINT chk_scan_logs_mode CHECK (scan_mode IN ('full', 'incremental'))
);

CREATE INDEX idx_scan_logs_started_at ON scan_logs(started_at DESC);
```

### 11.3 `duplicate_groups`

```sql
CREATE TABLE duplicate_groups (
    id                  SERIAL PRIMARY KEY,
    representative_path TEXT NOT NULL,
    candidate_paths     JSONB NOT NULL DEFAULT '[]'::jsonb,
    similarity_score    NUMERIC(4,3) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_duplicate_groups_similarity ON duplicate_groups(similarity_score DESC);
```

