# System 08 詳細設計
## 未体験作業 タスク洗い出し＆優先順位付けエージェント

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/analyze.py
├── schemas/analysis.py
├── services/query_planner.py
├── services/search_evaluator.py
├── services/task_generator.py
├── services/priority_scorer.py
├── services/export_service.py
├── agents/orchestrator.py
├── repositories/analysis_repository.py
└── prompts/task_agent_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| AnalyzeRouter | 分析 API | `start_analysis()`, `get_analysis()`, `update_task_status()` |
| LangGraph Orchestrator | ステップ制御 | `run_graph()` |
| QueryPlanner | 追加調査クエリ生成 | `plan_queries()` |
| SearchEvaluator | 情報充足度判定 | `need_more_search()` |
| TaskGenerator | タスク洗い出し | `generate_tasks()` |
| PriorityScorer | 緊急度・重要度算出 | `score_priority()` |
| ExportService | JSON/Markdown/CSV 出力 | `export_analysis()` |

## 3. API 詳細

### 3.1 POST `/analyze`
- 入力: テーマ、背景、目的、制約
- 処理:
  1. 初期理解
  2. 検索クエリ生成
  3. 情報収集
  4. タスク抽出
  5. 優先順位付け
- 応答: `analysis_id`, `summary`, `tasks[]`

### 3.2 GET `/analyses/{analysis_id}` / GET `/analyses`
- 詳細はタスク一覧、優先度、依存関係、根拠を返す

### 3.3 PATCH `/analyses/{analysis_id}/tasks/{task_id}`
- 更新対象: `status`, `memo`

### 3.4 GET `/analyses/{analysis_id}/export`
- `format=markdown|json|csv`

## 4. 詳細API I/O 定義

### 4.1 POST `/analyze`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `goal` | string | ○ | 分析対象作業 |
| `context` | string | ○ | 前提情報 |
| `constraints` | string[] |  | 制約条件 |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `analysis_id` | integer | 分析ID |
| `status` | string | queued / running / completed |
| `tasks[]` | object[] | 洗い出しタスク |

### 4.2 GET `/analyses/{analysis_id}` / GET `/analyses`

| 項目 | 型 | 説明 |
|---|---|---|
| `analysis_id` | integer | 詳細対象 |
| `status` | string | 実行状態 |
| `priority_summary` | object | 優先度別件数 |
| `tasks[]` | object[] | タスク一覧 |

### 4.3 PATCH `/analyses/{analysis_id}/tasks/{task_id}`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `status` | string | ○ | todo / doing / done |
| `memo` | string |  | 補足メモ |

### 4.4 GET `/analyses/{analysis_id}/export`

| 項目 | 型 | 説明 |
|---|---|---|
| `format` | string | markdown / csv |
| `download_url` | string | 出力先 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /analyze` | `goal`,`context` | 必須 |
| `POST /analyze` | 制約条件 | 配列形式 |
| `PATCH /analyses/{analysis_id}/tasks/{task_id}` | タスク状態 | 許可値のみ |
| `GET /analyses/{analysis_id}/export` | 出力形式 | 許可形式のみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `analysis_not_found` | 404 | 分析不存在 |
| `invalid_task_status` | 400 | 状態値不正 |
| `export_not_ready` | 409 | 出力未準備 |
| `analysis_timeout` | 504 | 分析タイムアウト |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `priority` | `high/medium/low` 等の許可値のみ | 422 を返す |
| `tasks[]` | 1件以上 | 422 を返す |
| `status` | `todo/doing/done` 等のみ | 400 を返す |

## 8. データベース詳細

### 8.1 `analyses`
- `theme`, `background`, `search_count`, `summary`, `created_at`

### 8.2 `tasks`
- `analysis_id`, `title`, `category`, `priority`, `quadrant`, `dependencies`, `status`, `reason`

## 9. AI 処理詳細

- タスクは「やること」が主語になる文で出力する
- 優先度は `high / medium / low`
- `quadrant` は `緊急かつ重要` など 4 象限で保持する
- 検索根拠のないタスクは禁止し、各タスクに `evidence` を持たせる

## 10. 状態遷移・運用設計

- `analyses.status`: `created -> researching -> analyzed -> exported`
- `tasks.status`: `todo -> doing -> done`
- 再分析時は旧タスクを履歴として残し、新しい分析結果を別レコードで作成する

## 11. DDL

### 11.1 `analyses`

```sql
CREATE TABLE analyses (
    id           SERIAL PRIMARY KEY,
    theme        VARCHAR(255) NOT NULL,
    background   TEXT,
    summary      TEXT,
    search_count INTEGER NOT NULL DEFAULT 0,
    status       VARCHAR(20) NOT NULL DEFAULT 'created',
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_analyses_status
        CHECK (status IN ('created', 'researching', 'analyzed', 'exported'))
);

CREATE INDEX idx_task_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_task_analyses_status     ON analyses(status);
```

### 11.2 `tasks`

```sql
CREATE TABLE tasks (
    id            SERIAL PRIMARY KEY,
    analysis_id   INTEGER NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    category      VARCHAR(50),
    priority      VARCHAR(10) NOT NULL,
    quadrant      VARCHAR(20),
    dependencies  JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence      JSONB NOT NULL DEFAULT '[]'::jsonb,
    reason        TEXT,
    memo          TEXT,
    status        VARCHAR(20) NOT NULL DEFAULT 'todo',
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('high', 'medium', 'low')),
    CONSTRAINT chk_tasks_status CHECK (status IN ('todo', 'doing', 'done'))
);

CREATE INDEX idx_tasks_analysis_id ON tasks(analysis_id);
CREATE INDEX idx_tasks_priority    ON tasks(priority);
CREATE INDEX idx_tasks_status      ON tasks(status);
```

