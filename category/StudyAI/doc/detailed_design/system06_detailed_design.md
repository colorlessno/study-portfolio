# System 06 詳細設計
## カスタマーサポート 自動応答＆エスカレーションシステム

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/inquiries.py
├── api/routes/faq.py
├── api/routes/stats.py
├── schemas/inquiry.py
├── schemas/faq.py
├── services/inquiry_classifier.py
├── services/faq_retriever.py
├── services/response_generator.py
├── services/escalation_service.py
├── services/feedback_service.py
├── repositories/inquiry_repository.py
├── repositories/faq_repository.py
└── prompts/support_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| InquiryRouter | 問い合わせ受付と状態更新 | `create_inquiry()`, `update_status()` |
| InquiryClassifier | 分類と優先度判定 | `classify()` |
| FAQRetriever | FAQ と過去回答検索 | `retrieve()` |
| ResponseGenerator | 回答文生成 | `generate_response()` |
| EscalationService | 担当者エスカレーション | `should_escalate()`, `create_escalation()` |
| FeedbackService | 解決評価反映 | `apply_feedback()` |
| FAQAdminService | FAQ 登録・一括取込 | `create_faq()`, `import_faqs()` |

## 3. API 詳細

### 3.1 POST `/inquiries`
- 入力: `channel`, `customer_text`, `customer_id?`
- 処理:
  1. 分類
  2. FAQ 検索
  3. 回答生成
  4. エスカレーション要否判定
- 応答: `category`, `priority`, `response_text`, `escalated`

### 3.2 POST `/inquiries/{inquiry_id}/feedback`
- 入力: `resolved`, `rating`, `comment`
- FAQ ヒット精度と未回答質問集計に利用する

### 3.3 PATCH `/inquiries/{inquiry_id}/status`
- 状態: `open`, `answered`, `escalated`, `closed`
- 人手対応時の担当者、対応メモを保持する

### 3.4 FAQ / 統計 API
- `POST /faq`
- `POST /faq/import`
- `GET /inquiries`
- `GET /stats/summary`

## 4. 詳細API I/O 定義

### 4.1 POST `/inquiries`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `channel` | string | ○ | mail / chat / form |
| `customer_id` | string |  | 顧客識別子 |
| `message` | string | ○ | 問い合わせ本文 |
| `category_hint` | string |  | 補助カテゴリ |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `inquiry_id` | integer | 問い合わせID |
| `status` | string | open / answered / escalated |
| `answer` | string | 自動回答本文 |
| `escalation_required` | boolean | エスカレーション要否 |

### 4.2 POST `/inquiries/{inquiry_id}/feedback`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `is_helpful` | boolean | ○ | 回答評価 |
| `comment` | string |  | 補足コメント |

### 4.3 PATCH `/inquiries/{inquiry_id}/status`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `status` | string | ○ | open / resolved / escalated |
| `assigned_to` | string |  | 担当者 |

### 4.4 FAQ / 統計 API
**対象API**: `POST /faq`, `POST /faq/import`, `GET /inquiries`, `GET /stats/summary`

| 項目 | 型 | 説明 |
|---|---|---|
| `question`, `answer` | string | FAQ 登録 |
| `faq_file` | binary | FAQ一括取込 |
| `from_date` / `to_date` | string(date) | 問い合わせ検索期間 |
| `summary` | object | 件数、解決率、エスカレーション率 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /inquiries` | `message` | 空文字不可 |
| `POST /inquiries` | `channel` | 許可チャネルのみ |
| `POST /inquiries/{inquiry_id}/feedback` | フィードバック値 | boolean 必須 |
| `PATCH /inquiries/{inquiry_id}/status` | 状態遷移 | 定義済み遷移のみ |
| FAQ API | 取込ファイル | 許可形式のみ |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `inquiry_not_found` | 404 | 問い合わせ不存在 |
| `invalid_status_transition` | 409 | 状態遷移不正 |
| `faq_import_failed` | 400 | FAQ取込失敗 |
| `auto_answer_failed` | 500 | 自動回答生成失敗 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `channel` | `mail/chat/form` 等の許可値のみ | 400 を返す |
| `status` | `open/answered/escalated/resolved` を許可 | 400 を返す |
| FAQ項目 | `question`,`answer` 必須 | 保存拒否 |

## 8. データベース詳細

### 8.1 `inquiries`
- `id`, `channel`, `customer_text`, `category`, `priority`, `confidence`, `response_text`, `status`, `created_at`

### 8.2 `faqs`
- `question`, `answer`, `category`, `embedding`, `is_active`

### 8.3 `sessions`
- 連続会話対応用の `session_id`, `last_inquiry_id`, `history_json`

### 8.4 `escalations`
- `inquiry_id`, `assignee`, `reason`, `notified_at`, `handled_at`

## 9. AI 処理詳細

- 分類ラベルは固定語彙
- 優先度は `high / medium / low`
- FAQ 根拠が弱い場合は自動回答せずエスカレーション優先
- 回答文は敬体、1 問い合わせ 1 主回答を原則にする

## 10. エラー・運用設計

- FAQ 一括取込で失敗した行は行番号付きで返す
- 問い合わせ受付失敗でも原文はロストさせず、最低限 `inquiries` に原文保存する
- `stats/summary` は件数、分類分布、エスカレーション率、解決率を返す

## 11. DDL

### 11.1 `inquiries`

```sql
CREATE TABLE inquiries (
    id             SERIAL PRIMARY KEY,
    channel        VARCHAR(20) NOT NULL,
    customer_id    VARCHAR(50),
    customer_text  TEXT NOT NULL,
    category       VARCHAR(50),
    priority       VARCHAR(10),
    confidence     NUMERIC(3,2),
    response_text  TEXT,
    status         VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_inquiries_priority CHECK (priority IS NULL OR priority IN ('high', 'medium', 'low')),
    CONSTRAINT chk_inquiries_status CHECK (status IN ('open', 'answered', 'escalated', 'closed'))
);

CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_status     ON inquiries(status);
CREATE INDEX idx_inquiries_category   ON inquiries(category);
```

### 11.2 `faqs`

```sql
CREATE TABLE faqs (
    id         SERIAL PRIMARY KEY,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    category   VARCHAR(50),
    embedding  VECTOR(1536),
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_category  ON faqs(category);
CREATE INDEX idx_faqs_is_active ON faqs(is_active);
CREATE INDEX idx_faqs_embedding ON faqs USING ivfflat (embedding vector_cosine_ops);
```

### 11.3 `sessions`

```sql
CREATE TABLE sessions (
    session_id       VARCHAR(50) PRIMARY KEY,
    customer_id      VARCHAR(50),
    last_inquiry_id  INTEGER REFERENCES inquiries(id),
    history_json     JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.4 `escalations`

```sql
CREATE TABLE escalations (
    id          SERIAL PRIMARY KEY,
    inquiry_id  INTEGER NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    assignee    VARCHAR(50),
    reason      TEXT NOT NULL,
    notified_at TIMESTAMP,
    handled_at  TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_escalations_inquiry_id ON escalations(inquiry_id);
CREATE INDEX idx_escalations_assignee   ON escalations(assignee);
```

