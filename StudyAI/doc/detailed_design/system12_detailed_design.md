# System 12 詳細設計
## ギフのC コンシェルジュ＆推薦システム

---

## 1. 実装ディレクトリ構成

```text
app/
├── api/routes/chat.py
├── api/routes/products.py
├── api/routes/ontology.py
├── api/routes/analytics.py
├── schemas/chat.py
├── schemas/product.py
├── agents/conversation_agent.py
├── agents/search_agent.py
├── agents/recommendation_agent.py
├── services/ontology_rule_engine.py
├── services/session_memory_service.py
├── repositories/product_repository.py
├── repositories/session_repository.py
└── prompts/gift_prompt.py
```

## 2. モジュール詳細

| モジュール | 役割 | 主な関数 |
|---|---|---|
| ChatRouter | 会話 API | `chat()`, `submit_feedback()` |
| ConversationAgent | 条件ヒアリング | `extract_conditions()`, `build_followup_question()` |
| SearchAgent | 商品候補検索 | `search_candidates()` |
| OntologyRuleEngine | NG 条件除外 | `apply_rules()` |
| RecommendationAgent | スコアリングと理由生成 | `rank_candidates()`, `generate_reason()` |
| SessionMemoryService | 会話条件保持 | `load_session()`, `save_conditions()` |
| ProductAdminService | 商品・オントロジー管理 | `create_product()`, `update_product()` |

## 3. API 詳細

### 3.1 POST `/chat`
- 入力: `session_id`, `message`
- 応答:
  - `response_type = question`: 条件不足時
  - `response_type = recommendation`: 条件充足時

### 3.2 POST `/chat/feedback`
- 推薦に対する `liked`, `disliked_reasons`, `selected_product_id` を受ける

### 3.3 管理 API
- `POST /products`
- `PUT /products/{product_id}`
- `POST /ontology/scenes`
- `POST /ontology/ng-rules`
- `GET /analytics/recommendations`

## 4. 詳細API I/O 定義

### 4.1 POST `/chat`
**リクエスト**

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `session_id` | string | ○ | 会話セッション |
| `message` | string | ○ | 利用者発話 |

**レスポンス**

| 項目 | 型 | 説明 |
|---|---|---|
| `response_type` | string | question / recommendation |
| `message` | string | 応答本文 |
| `collected_conditions` | object | 抽出済み条件 |
| `recommendations[]` | object[] | 商品候補と理由 |

### 4.2 POST `/chat/feedback`

| 項目 | 型 | 必須 | 説明 |
|---|---|---|---|
| `session_id` | string | ○ | 対象セッション |
| `liked` | boolean | ○ | 推薦評価 |
| `disliked_reasons` | string[] |  | 不満理由 |
| `selected_product_id` | integer |  | 選択商品 |

### 4.3 管理 API
**対象API**: `POST /products`, `PUT /products/{product_id}`, `POST /ontology/scenes`, `POST /ontology/ng-rules`, `GET /analytics/recommendations`

| 項目 | 型 | 説明 |
|---|---|---|
| `name`, `price`, `category` | mixed | 商品基本情報 |
| `tags` | string[] | 商品特徴 |
| `scene`, `recipient`, `rule` | mixed | オントロジー定義 |
| `analytics` | object | 推薦件数、選択率、離脱率 |

## 5. 入力チェック仕様
| 対象 | チェック項目 | ルール |
|---|---|---|
| `POST /chat` | `session_id`,`message` | 必須 |
| `POST /chat/feedback` | フィードバック | `liked` 必須 |
| 管理 API | 商品情報 | `name`,`price` 必須 |
| 管理 API | オントロジー定義 | 必須キーを保持 |

## 6. エラー応答仕様
共通レスポンス形式:
```json
{"error_code":"string","message":"string","details":{},"trace_id":"string"}
```

| error_code | HTTP | 発生条件 |
|---|---|---|
| `session_not_found` | 404 | セッション不存在 |
| `insufficient_conditions` | 409 | 条件不足 |
| `invalid_product_data` | 400 | 商品入力不正 |
| `ontology_conflict` | 409 | ルール競合 |

## 7. バリデーション一覧
| 対象 | ルール | 不正時挙動 |
|---|---|---|
| `response_type` | `question/recommendation` のみ | 422 を返す |
| `price` | 0以上 | 保存拒否 |
| `recommendations[]` | 上位件数上限内 | 再生成 |

## 8. データベース詳細

### 8.1 `products`
- `name`, `price`, `category`, `tags`, `embedding`, `active_flag`

### 8.2 `scenes` / `recipients` / `ng_rules`
- `scenes`: 贈答シーン定義
- `recipients`: 相手属性定義
- `ng_rules`: シーン・相手・価格帯に対する除外条件

### 8.3 `sessions` / `recommendation_logs`
- `sessions`: 収集済み条件、会話履歴、除外条件
- `recommendation_logs`: 提案候補、score、feedback

## 9. AI 処理詳細

- 抽出条件: `scene`, `recipient`, `budget`, `preference`, `ng_items`
- 推薦理由は商品属性と条件を必ず 1 対 1 で対応付ける
- NG 商品はスコアリング対象に含めない

## 10. 状態・運用設計

- 条件が不十分な限り recommendation へ進ませない
- 同一セッションで既に提案済みの商品は優先度を下げる
- analytics は選択率、離脱率、NG 理由分布を集計する

## 11. DDL

### 11.1 `products`

```sql
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    price       NUMERIC(10,0) NOT NULL,
    category    VARCHAR(50),
    tags        JSONB NOT NULL DEFAULT '[]'::jsonb,
    embedding   VECTOR(1536),
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category  ON products(category);
CREATE INDEX idx_products_active    ON products(active_flag);
CREATE INDEX idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops);
```

### 11.2 `scenes`

```sql
CREATE TABLE scenes (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.3 `recipients`

```sql
CREATE TABLE recipients (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.4 `ng_rules`

```sql
CREATE TABLE ng_rules (
    id           SERIAL PRIMARY KEY,
    scene_id     INTEGER REFERENCES scenes(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
    rule_type    VARCHAR(50) NOT NULL,
    rule_value   JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.5 `sessions`

```sql
CREATE TABLE sessions (
    session_id    VARCHAR(50) PRIMARY KEY,
    conditions    JSONB NOT NULL DEFAULT '{}'::jsonb,
    chat_history  JSONB NOT NULL DEFAULT '[]'::jsonb,
    excluded_ids  JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 11.6 `recommendation_logs`

```sql
CREATE TABLE recommendation_logs (
    id                SERIAL PRIMARY KEY,
    session_id        VARCHAR(50) NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    product_id        INTEGER REFERENCES products(id),
    score             NUMERIC(5,2),
    feedback          JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendation_logs_session_id ON recommendation_logs(session_id);
CREATE INDEX idx_recommendation_logs_product_id ON recommendation_logs(product_id);
```

