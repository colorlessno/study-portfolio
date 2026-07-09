# System 07 詳細設計
## プロジェクト内ドキュメント 自動タグ付け＆類似ドキュメント推薦システム

---

## 1. 実装ディレクトリ構成

> **デプロイ前提：1デプロイ = 1プロジェクト**
> 本システムは1デプロイインスタンスが1プロジェクトに対応する前提で設計されている。`project_id` によるデータ分離・プロジェクト一覧取得APIは将来対応予定。アクセス制御は現在 `access_roles`（ロールベース）のみで実現する。

```text
app/
├── api/routes/catalog.py
├── api/routes/tags.py
├── api/routes/stats.py
├── schemas/document.py
├── schemas/tag.py
├── services/tagging_engine.py
├── services/similarity_engine.py
├── services/duplicate_detector.py
├── services/tag_admin_service.py
├── services/access_analytics.py
├── repositories/document_repository.py
├── repositories/tag_repository.py
└── prompts/tagging_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| CatalogRouter | 文書登録・検索・類似推薦 | `create_document()`, `list_documents()`, `get_similar_documents()` |
| TaggingEngine | タグ付け、カテゴリ分類、要約 | `analyze_document()` |
| SimilarityEngine | 類似検索 | `find_similar()` |
| DuplicateDetector | 重複候補算出 | `detect_duplicates()` |
| TagAdminService | タグ更新・統合 | `update_tags()`, `merge_tags()` |
| AccessAnalytics | 利用状況集計 | `get_access_stats()`, `get_unused_documents()` |

## 3. API 詳細

### 3.1 文書 API
- `POST /documents`
- `POST /documents/bulk`
- `GET /documents`
- `GET /documents/{document_id}`
- `GET /documents/{document_id}/similar`

### 3.2 タグ API
- `PUT /documents/{document_id}/tags`
  - 入力: `tags[]`, `category`, `importance`
  - 既存タグとの差分更新を行う
- `GET /tags`
- `POST /tags/merge`

### 3.3 統計 API
- `GET /stats/access`
- `GET /stats/unused-documents`

## 4. 詳細API I/O 定義

### 4.1 文書 API
**対象API**: `POST /documents`, `POST /documents/bulk`, `GET /documents`, `GET /documents/{document_id}`, `GET /documents/{document_id}/similar`

| 項目 | 型 | 説明 |
|---|---|---|
| `file` / `files[]` | binary / binary[] | 登録ファイル |
| `category` | string | 文書カテゴリ |
| `tags` | string[] | 初期タグ |
| `document_id` | integer | 文書識別子 |
| `similar_documents[]` | object[] | 類似文書候補と類似度 |

### 4.2 タグ API
**対象API**: `PUT /documents/{document_id}/tags`, `GET /tags`, `POST /tags/merge`

| 項目 | 型 | 説明 |
|---|---|---|
| `tags` | string[] | 文書タグ全置換 |
| `source_tag` / `target_tag` | string | マージ元/先 |
| `tag_stats[]` | object[] | 利用数・関連文書数 |

### 4.3 統計 API
**対象API**: `GET /stats/access`, `GET /stats/unused-documents`

| 項目 | 型 | 説明 |
|---|---|---|
| `from_date` / `to_date` | string(date) | 集計期間 |
| `access_stats[]` | object[] | 文書別アクセス件数 |
| `unused_documents[]` | object[] | 未使用候補文書 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| 文書 API | 登録ファイル | 許可形式のみ |
| 文書 API | 一括登録件数 | 上限件数以内 |
| タグ API | タグ配列 | 空配列不可 |
| `POST /tags/merge` | タグ指定 | `source_tag` と `target_tag` の両方必須 |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `document_not_found` | 404 | 文書不存在 |
| `duplicate_document` | 409 | 重複登録 |
| `invalid_tag_merge` | 400 | タグ統合条件不正 |
| `index_update_failed` | 500 | 索引更新失敗 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `access_roles` | 配列形式で保持 | 保存拒否 |
| `tags` | 正規化済み文字列のみ | 保存拒否 |
| 類似度 | 0.0〜1.0 | 再計算 |

## 8. データベース詳細

### 8.1 `documents`
- `file_name`, `title`, `category`, `summary`, `file_hash`, `status`, `registered_by`, `access_roles`

### 8.2 `document_chunks`
- `document_id`, `chunk_no`, `chunk_text`, `embedding`

### 8.3 `tags` / `document_tags`
- `tags`: 正規タグ名、同義語、統合先タグ
- `document_tags`: 文書とタグの中間テーブル

### 8.4 `access_logs`
- `document_id`, `user_id`, `accessed_at`, `action_type`

## 9. AI 処理詳細

- 自動付与対象: `category`, `sub_category`, `document_type`, `importance`, `tags`, `summary`
- 要約は 3 行以内
- 既存タグと近似度が高い新規タグは「候補」として返し、自動採用しない

## 10. 検索・統合設計

- 類似検索は `document_chunks.embedding` で実施
- 同一 hash は重複候補として優先表示
- タグ統合時は `document_tags` の参照先を統合先へ一括更新する

## 11. DDL

### 11.1 `documents`

```sql
CREATE TABLE documents (
    id            SERIAL PRIMARY KEY,
    file_name     VARCHAR(255) NOT NULL,
    title         VARCHAR(255),
    category      VARCHAR(50),
    summary       TEXT,
    file_hash     VARCHAR(64) NOT NULL UNIQUE,
    status        VARCHAR(20) NOT NULL DEFAULT 'active',
    registered_by VARCHAR(50) NOT NULL,
    access_roles  JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_documents_status CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX idx_catalog_documents_category ON documents(category);
CREATE INDEX idx_catalog_documents_status   ON documents(status);
```

### 11.2 `document_chunks`

```sql
CREATE TABLE document_chunks (
    id          SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_no    INTEGER NOT NULL,
    chunk_text  TEXT NOT NULL,
    embedding   VECTOR(1536),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (document_id, chunk_no)
);

CREATE INDEX idx_catalog_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_catalog_chunks_embedding   ON document_chunks USING ivfflat (embedding vector_cosine_ops);
```

### 11.3 `tags`

```sql
CREATE TABLE tags (
    id             SERIAL PRIMARY KEY,
    normalized_name VARCHAR(100) NOT NULL UNIQUE,
    synonyms       JSONB NOT NULL DEFAULT '[]'::jsonb,
    merged_to_tag_id INTEGER REFERENCES tags(id),
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.4 `document_tags`

```sql
CREATE TABLE document_tags (
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tag_id      INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (document_id, tag_id)
);

CREATE INDEX idx_document_tags_tag_id ON document_tags(tag_id);
```

### 11.5 `access_logs`

```sql
CREATE TABLE access_logs (
    id          SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id     VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    accessed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_logs_document_id ON access_logs(document_id);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at DESC);
```

