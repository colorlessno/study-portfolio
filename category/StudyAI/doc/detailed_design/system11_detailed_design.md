# System 11 詳細設計
## ローカルPCファイル自動整理エージェント

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/organizer.py
├── schemas/plan.py
├── services/scan_service.py
├── services/plan_generator.py
├── services/preview_service.py
├── services/execution_service.py
├── services/rollback_service.py
├── services/path_safety_service.py
├── services/settings_service.py
├── repositories/plan_repository.py
├── repositories/execution_repository.py
├── repositories/execution_item_repository.py
└── prompts/organize_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| OrganizerRouter | 整理案生成・実行 API | `scan()`, `execute()`, `rollback()` |
| ScanService | 対象ファイル収集 | `collect_files()` |
| PlanGenerator | 整理案生成 | `generate_plan()` |
| PreviewService | 実行前差分表示 | `build_preview()` |
| ExecutionService | move / rename / archive 実行 | `execute_plan()` |
| RollbackService | 巻き戻し | `rollback_execution()` |
| PathSafetyService | パス正規化・危険判定 | `normalize_path()`, `validate_scope()` |
| SettingsService | 監視設定保存 | `save_settings()` |

## 3. API 詳細

- `POST /scan`
  - 入力: `watch_folders[]`, `exclude_patterns[]`, `mode`
  - 応答: 整理案、移動候補、リネーム候補、アーカイブ候補
- `POST /execute`
  - 入力: 承認済み plan
  - 実行前に絶対パス検証、競合検査、ロック検査を行う
- `POST /rollback/{execution_id}`
  - `executions.rollback_data` を参照して巻き戻す
- `GET /executions`
- `GET /executions/{execution_id}/report`
- `POST /settings`

## 4. 詳細API I/O 定義

### 4.1 POST `/scan`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `watch_folders[]` | string[] | ○ | 監視対象 |
| `exclude_patterns[]` | string[] |  | 除外条件 |
| `mode` | string | ○ | preview / execute |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `plan_id` | string | 整理案ID |
| `summary` | string | 整理方針要約 |
| `actions[]` | object[] | move / rename / archive / keep |

### 4.2 POST `/execute`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `plan_id` | string | ○ | 承認済み整理案 |
| `approved_actions[]` | object[] | ○ | 実行対象アクション |
| `approved_actions[].action_id` | string | ○ | plan 内 action 識別子 |
| `approved_actions[].target_path` | string | ○ | 実行時の期待移動先 |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `execution_id` | string | 実行ID |
| `result` | string | success / partial / failed |
| `moved_count` / `renamed_count` | integer | 実行件数 |
| `item_results[]` | object[] | action_id, status, error_code, rollbackable |

### 4.3 POST `/rollback/{execution_id}` / GET `/executions` / GET `/executions/{execution_id}/report` / POST `/settings`

| 項目 | 型 | 説明 |
|---|---|---|
| `execution_id` | string | 巻き戻し対象 |
| `rollback_result` | string | 巻き戻し結果 |
| `executions[]` | object[] | 実行履歴 |
| `watch_folders[]`, `exclude_patterns[]`, `mode` | mixed | 監視設定 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /scan` | `watch_folders[]` | 1件以上必須 |
| `POST /scan` | `mode` | `preview/execute` のみ |
| `POST /execute` | `plan_id` | 既存計画のみ |
| `POST /execute` | `approved_actions[].target_path` | 監視フォルダ配下または出力フォルダ配下のみ |
| `POST /execute` | `approved_actions[]` | 同一 target_path の重複不可 |
| `POST /rollback/{execution_id}` | 対象実行 | 既存 execution のみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `unsafe_path_detected` | 403 | 監視対象外パス |
| `plan_not_found` | 404 | 計画不存在 |
| `name_conflict` | 409 | 移動先名衝突 |
| `file_locked` | 409 | 使用中ファイル |
| `symlink_not_supported` | 400 | リンク系ファイル指定 |
| `execution_failed` | 500 | 実行失敗 |
| `rollback_failed` | 500 | 巻き戻し失敗 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `actions[]` | `move/rename/archive/keep` のみ | 実行拒否 |
| `rollback_data` | 前後パスを完全保持 | 実行拒否 |
| `mode` | preview/execute のみ | 400 を返す |
| `source_path` / `target_path` | 正規化後に同一でない | 実行拒否 |
| `target_path` | 絶対パス・許可配下のみ | 403 を返す |

## 8. データベース詳細

### 8.1 `plans`
- `plan_id`, `summary`, `actions_json`, `status`, `created_at`

### 8.2 `executions`
- `execution_id`, `plan_id`, `result`, `rollback_data`, `executed_at`

### 8.3 `execution_items`
- `execution_id`, `action_type`, `source_path`, `target_path`, `status`, `error_code`, `rollbackable`

### 8.4 `settings`
- `watch_folders`, `exclude_patterns`, `mode`, `updated_at`

## 9. AI 処理詳細

- 整理案は `move / rename / archive / keep` のみ
- 危険操作は提案しても自動実行しない
- 理由文は「なぜその整理案か」をファイル名・更新日・配置規則から説明する

## 10. 安全設計

- 実行対象パスは監視フォルダ配下に限定
- 削除は行わない
- ロールバック情報は move 前 path、move 後 path、rename 前後名を完全保持する
- パスは `GetFullPath` 相当で正規化し、末尾区切りと大小文字差分を吸収して判定する
- リンク系ファイルは解析対象に含めても実行対象にはしない
- 競合検査は実行直前に再評価し、競合時は対象 action のみ失敗扱いにする
- 部分失敗時も残り action を継続し、`executions.result = partial` を許容する
- ロールバックは `execution_items.rollbackable = true` の成功 action に限定する

## 11. DDL

### 11.1 `plans`

```sql
CREATE TABLE plans (
    plan_id      VARCHAR(50) PRIMARY KEY,
    summary      TEXT,
    actions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    status       VARCHAR(20) NOT NULL DEFAULT 'created',
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_plans_status CHECK (status IN ('created', 'approved', 'executed', 'cancelled'))
);

CREATE INDEX idx_plans_created_at ON plans(created_at DESC);
```

### 11.2 `executions`

```sql
CREATE TABLE executions (
    execution_id   VARCHAR(50) PRIMARY KEY,
    plan_id        VARCHAR(50) NOT NULL REFERENCES plans(plan_id),
    result         VARCHAR(20) NOT NULL,
    rollback_data  JSONB NOT NULL DEFAULT '[]'::jsonb,
    success_count  INTEGER NOT NULL DEFAULT 0,
    failed_count   INTEGER NOT NULL DEFAULT 0,
    executed_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_executions_result CHECK (result IN ('success', 'partial', 'failed', 'rolled_back'))
);

CREATE INDEX idx_executions_plan_id     ON executions(plan_id);
CREATE INDEX idx_executions_executed_at ON executions(executed_at DESC);
```

### 11.3 `execution_items`

```sql
CREATE TABLE execution_items (
    id            SERIAL PRIMARY KEY,
    execution_id  VARCHAR(50) NOT NULL REFERENCES executions(execution_id) ON DELETE CASCADE,
    action_type   VARCHAR(20) NOT NULL,
    source_path   TEXT NOT NULL,
    target_path   TEXT,
    status        VARCHAR(20) NOT NULL,
    error_code    VARCHAR(50),
    rollbackable  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_execution_items_action_type CHECK (action_type IN ('move', 'rename', 'archive', 'keep')),
    CONSTRAINT chk_execution_items_status CHECK (status IN ('success', 'failed', 'skipped', 'conflict', 'locked'))
);

CREATE INDEX idx_execution_items_execution_id ON execution_items(execution_id);
CREATE INDEX idx_execution_items_status       ON execution_items(status);
```

### 11.4 `settings`

```sql
CREATE TABLE settings (
    id               SERIAL PRIMARY KEY,
    watch_folders    JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclude_patterns JSONB NOT NULL DEFAULT '[]'::jsonb,
    mode             VARCHAR(20) NOT NULL DEFAULT 'preview',
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_settings_mode CHECK (mode IN ('preview', 'execute'))
);
```

