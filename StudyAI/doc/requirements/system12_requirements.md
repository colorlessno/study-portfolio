# System 12 要件定義
## ギフのC コンシェルジュ＆推薦システム

---

## システム概要

ユーザーが贈り物の相談をすると、会話で条件を引き出し、自社商品DBから適切な候補を推薦し、LLMが推薦理由を生成して返すシステム。オントロジーによる意味設計と会話エージェントを組み合わせ、「ギフト選びの専門スタッフ」をAIで実現する。

---

## 現状の課題

- ギフト選びに迷うユーザーが離脱してしまう
- 「誰に・何のために・予算はいくら」の条件を引き出せず、的外れな商品を勧めてしまう
- 季節・シーン・贈答相手のマナーを考慮した推薦ができない
- 推薦理由を説明できず、ユーザーが選択に自信を持てない
- NGな商品（縁起・アレルギー・好みに合わない）を除外できない

---

## 対象ユーザー

- ギフのCサイトのエンドユーザー（贈り物を探している人）
- ECサイト運営者・MD担当者（商品・オントロジー管理側）

---

## オントロジー設計について

> 📝 **本システムにおけるオントロジー**
> 「商品」「贈答シーン」「贈答相手」「価格帯」「NG条件」といった概念と、その概念同士の意味関係をデータとして持つ構造。「焼き菓子 → 常温保存可 → 手土産向き」「高級酒 → 目上向け → 好み差が大きい」のような意味のつながりを定義することで、AIが文脈に応じた推薦判断をできるようにする。

---

## 機能要件

### 1. 会話型コンシェルジュ機能（マルチエージェント）
会話形式でユーザーから贈り物の条件を引き出す。

**エージェント構成**

```
オーケストレーター
├── 会話エージェント（条件収集・質問生成）
├── 検索エージェント（商品DB検索・フィルタリング）
└── 推薦エージェント（スコアリング・理由生成）
```

**収集する条件**

| 条件 | 質問例 |
|------|--------|
| 贈答相手 | 「誰に贈りますか？（上司・友人・親・義実家など）」 |
| 贈答シーン | 「どんな場面のギフトですか？（お中元・誕生日・出産祝いなど）」 |
| 予算 | 「予算はどのくらいをお考えですか？」 |
| 好み・NG | 「食品や酒類は大丈夫ですか？」 |
| 優先事項 | 「無難さ重視ですか？意外性重視ですか？」 |
| 配送 | 「直送ですか？持参ですか？」 |

**会話のフロー**
- 未入力の条件を検出して自然な質問を生成
- 最大3回の質問で条件を収集
- 条件が揃ったら推薦へ移行
- 「もう少し高いものが良い」などのフィードバックに対応

### 2. オントロジーDB機能
贈答に関する意味知識をDBで管理する。

**オントロジーのデータ構造**

| テーブル | 内容 |
|---------|------|
| scenes | 贈答シーン（お中元・お歳暮・誕生日・出産祝いなど） |
| recipients | 贈答相手（上司・部下・友人・親・義実家など） |
| ng_rules | NGルール（出産祝いに刃物はNG・義実家初訪問には無難なものなど） |
| scene_recipient_rules | シーン×相手の組み合わせルール |
| product_attributes | 商品の意味属性（常温保存可・要冷蔵・アルコール含む・甘いなど） |

**オントロジーの活用方法**
- 不適切商品の除外（NGルール参照）
- 推薦スコアへの重み付け（シーン×相手に適した属性を優遇）
- 推薦理由の根拠として使用

### 3. 商品DB・検索機能
商品マスタをDBで管理し、条件に応じてフィルタリング・検索する。

**商品マスタの項目**

| 項目 | 説明 |
|------|------|
| 商品ID | 識別番号 |
| 商品名 | 商品の名称 |
| カテゴリ | 食品・酒・スイーツ・雑貨・体験など |
| 価格 | 税込み価格 |
| 在庫状況 | 在庫あり・在庫なし・受注生産 |
| 属性 | 常温保存可・要冷蔵・アルコール含む・甘い・辛いなど |
| 向いているシーン | お中元・誕生日・出産祝いなど |
| 向いている相手 | 上司・友人・親など |
| フォーマル度 | 1〜5（1：カジュアル・5：フォーマル） |
| 説明文 | 商品の説明 |
| 画像URL | 商品画像 |

**検索・フィルタリング**
- 価格帯フィルター
- カテゴリフィルター
- 在庫フィルター
- オントロジーによるNG商品の除外
- pgvectorによる意味的な類似検索

### 4. 推薦・スコアリング機能
フィルタリングした商品候補をスコアリングして上位3〜5件を選定する。

**スコアリング要素**

| 要素 | 重み |
|------|------|
| シーン適合度 | 30% |
| 相手適合度 | 25% |
| 予算適合度 | 20% |
| フォーマル度適合度 | 15% |
| 人気度（閲覧数・購入数） | 10% |

### 5. 推薦理由生成機能（LLM）
LLMが各候補の推薦理由・注意点・向く相手を自然文で生成する。

**生成内容**

| 項目 | 説明 |
|------|------|
| 推薦理由 | なぜこの商品を勧めるか |
| 向いている人 | どんな相手・シーンに特に良いか |
| 注意点 | 贈る際に気をつけること |
| ラッピング提案 | 包装・のしの提案 |

### 6. フィードバック・絞り込み機能
推薦結果に対するフィードバックを受け取り、条件を調整して再推薦する。

- 「もっと高いものが良い」→ 価格帯を上げて再推薦
- 「食品以外が良い」→ カテゴリを除外して再推薦
- 「別の候補を見たい」→ 次の候補を提示

### 7. 会話履歴管理機能（メモリ）
同一セッション内での会話コンテキストを保持する。

- 収集済みの条件を記憶
- 推薦済みの商品を記憶（同じものを再提案しない）
- セッションは2時間で自動終了

### 8. 商品・オントロジー管理機能（管理者向け）
- 商品マスタのCRUD
- オントロジー（シーン・相手・NGルール）のCRUD
- 商品属性の一括インポート（CSV）
- 推薦ログの確認・分析

---

## 非機能要件

| 項目 | 要件 |
|------|------|
| 応答時間 | 会話応答：15秒以内 / 推薦生成：30秒以内 |
| 同時利用 | 最大50ユーザーの同時利用 |
| 対応言語 | 日本語 |
| セキュリティ | 会話ログは匿名化して保存 |

---

## システム構成

```
ユーザー（クライアント）
        ↓
    FastAPI（APIサーバー）
        ↓
    セッション管理（会話履歴・収集済み条件）
        ↓
    ┌──────────────────────────────────────────┐
    │  マルチエージェント（LangGraph）           │
    │                                          │
    │  オーケストレーター                        │
    │  ├── 会話エージェント                     │
    │  │   （条件収集・質問生成）               │
    │  │   ※ Qwen3-27B / LM Studio            │
    │  │                                       │
    │  ├── 検索エージェント                     │
    │  │   （商品DB検索・オントロジー参照）      │
    │  │   → pgvectorで類似商品検索            │
    │  │   → NGルールで不適切商品を除外         │
    │  │                                       │
    │  └── 推薦エージェント                     │
    │      （スコアリング・理由生成）            │
    │      ※ Qwen3-27B / LM Studio            │
    └──────────────────────────────────────────┘
        ↓
    出力バリデーション（Pydantic）
        ↓
    PostgreSQL（セッション・ログ保存）
        ↓
    JSONレスポンス返却
```

---

## API仕様

### POST /chat
会話メッセージを送信して応答を受け取る。

**リクエスト（JSON）**
```json
{
  "session_id": "sess_abc123",
  "message": "父の日のギフトを探しています"
}
```

**レスポンス（JSON）- 条件収集中**
```json
{
  "session_id": "sess_abc123",
  "response_type": "question",
  "message": "お父様へのギフトですね。予算はどのくらいをお考えですか？",
  "collected_conditions": {
    "scene": "父の日",
    "recipient": "父親"
  },
  "missing_conditions": ["budget", "preference", "ng_items"]
}
```

**レスポンス（JSON）- 推薦結果**
```json
{
  "session_id": "sess_abc123",
  "response_type": "recommendation",
  "message": "条件に合うギフトを3つご提案します。",
  "recommendations": [
    {
      "rank": 1,
      "product_id": 101,
      "product_name": "老舗和菓子 詰め合わせ（5,000円）",
      "price": 5000,
      "image_url": "https://example.com/product101.jpg",
      "reason": "目上の方への父の日ギフトとして定番の和菓子詰め合わせです。常温保存可能で日持ちもよく、相手を選ばない無難な一品です。",
      "suitable_for": "フォーマルな場面でも使える安心感のある贈り物です。",
      "cautions": "甘いものが苦手な場合はご確認ください。",
      "wrapping": "熨斗（父の日）をお付けすることをお勧めします。",
      "score": 0.94
    },
    {
      "rank": 2,
      "product_id": 205,
      "product_name": "クラフトビール 飲み比べセット（4,500円）",
      "price": 4500,
      "image_url": "https://example.com/product205.jpg",
      "reason": "お酒好きのお父様への父の日ギフトとして人気のクラフトビールセットです。普段とは違う特別感を演出できます。",
      "suitable_for": "お酒を楽しまれるお父様に特におすすめです。",
      "cautions": "アルコールが飲めない場合はご注意ください。",
      "wrapping": "ギフトボックス入りで見た目も華やかです。",
      "score": 0.88
    }
  ],
  "collected_conditions": {
    "scene": "父の日",
    "recipient": "父親",
    "budget": "5000円以内",
    "preference": "無難さ重視",
    "ng_items": "なし"
  }
}
```

### POST /chat/feedback
推薦結果へのフィードバックを送信して再推薦を受け取る。

**リクエスト（JSON）**
```json
{
  "session_id": "sess_abc123",
  "feedback": "もう少し高いものが良い",
  "excluded_product_ids": [101]
}
```

### POST /products
商品を登録する（管理者向け）。

### PUT /products/{product_id}
商品を更新する（管理者向け）。

### POST /ontology/scenes
贈答シーンを登録する（管理者向け）。

### POST /ontology/ng-rules
NGルールを登録する（管理者向け）。

### GET /analytics/recommendations
推薦ログを取得する（管理者向け）。

---

## データモデル

### productsテーブル
```sql
CREATE TABLE products (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    category      VARCHAR(50),
    price         NUMERIC(10,0),
    stock_status  VARCHAR(20) DEFAULT '在庫あり',
    attributes    JSONB,          -- 商品属性（常温保存可・アルコール含むなど）
    suitable_scenes JSONB,        -- 向いているシーン
    suitable_recipients JSONB,    -- 向いている相手
    formality     INTEGER,        -- フォーマル度（1〜5）
    description   TEXT,
    image_url     VARCHAR(500),
    view_count    INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    embedding     VECTOR(1536),   -- pgvector
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);
```

### scenesテーブル
```sql
CREATE TABLE scenes (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    formality   INTEGER,            -- フォーマル度（1〜5）
    timing      VARCHAR(100),       -- 時期（6月中旬・誕生日当日など）
    description TEXT
);
```

### recipientsテーブル
```sql
CREATE TABLE recipients (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    formality   INTEGER,            -- 関係の格式度（1〜5）
    description TEXT
);
```

### ng_rulesテーブル
```sql
CREATE TABLE ng_rules (
    id           SERIAL PRIMARY KEY,
    scene_id     INTEGER REFERENCES scenes(id),
    recipient_id INTEGER REFERENCES recipients(id),
    ng_attribute VARCHAR(100),      -- NGとなる商品属性
    reason       TEXT,              -- なぜNGなのか
    severity     VARCHAR(10)        -- 絶対NG・推奨しない
);
```

### sessionsテーブル
```sql
CREATE TABLE sessions (
    id                   VARCHAR(50) PRIMARY KEY,
    collected_conditions JSONB,
    recommended_ids      JSONB,     -- 推薦済み商品IDリスト
    history              JSONB,     -- 会話履歴
    created_at           TIMESTAMP DEFAULT NOW(),
    expires_at           TIMESTAMP
);
```

### recommendation_logsテーブル
```sql
CREATE TABLE recommendation_logs (
    id            SERIAL PRIMARY KEY,
    session_id    VARCHAR(50),
    conditions    JSONB,
    recommended   JSONB,
    feedback      TEXT,
    created_at    TIMESTAMP DEFAULT NOW()
);
```

---

## プロンプト仕様

### 会話エージェント（条件収集）プロンプト
```
あなたはギフト専門のコンシェルジュAIです。
ユーザーが最適なギフトを見つけられるよう、自然な会話で必要な条件を引き出してください。

収集済みの条件：
{collected_conditions}

未収集の条件：
{missing_conditions}

会話履歴：
{conversation_history}

ルール：
1. 一度に1つだけ質問すること
2. 自然で親しみやすい言葉遣いにすること
3. すでに収集した条件は再度聞かないこと
4. 条件が揃ったら推薦フェーズに移行すること
5. 必ず指定のJSONフォーマットで返すこと
```

### 推薦理由生成プロンプト
```
あなたはギフト専門のコンシェルジュAIです。
以下の条件と候補商品に対して、推薦理由・注意点・ラッピング提案を生成してください。

贈答条件：
{conditions}

オントロジー情報（シーン・相手のルール）：
{ontology_info}

推薦候補商品：
{products}

ルール：
1. 推薦理由はオントロジー情報を根拠にすること
2. 贈る相手・シーンに合った言葉遣いにすること
3. 注意点は押しつけがましくなく、さりげなく伝えること
4. 必ず指定のJSONフォーマットで返すこと
```

---

## ガードレール設計

- JSON形式が壊れていた場合：最大3回まで再試行
- 在庫なし商品は推薦対象から除外
- NGルールに該当する商品は必ず除外
- 同一商品を同一セッション内で再推薦しない
- 質問は最大3回まで（それ以上は収集済み条件で推薦）
- セッション2時間経過で自動終了

---

## 技術スタック

| 用途 | 技術 |
|------|------|
| APIサーバー | FastAPI |
| エージェントフレームワーク | LangGraph |
| LLM | Qwen3-27B（Q4量子化）/ LM Studio経由 |
| 埋め込みモデル | nomic-embed-text（ローカル）/ LM Studio経由 |
| ベクトルDB | pgvector（PostgreSQL拡張） |
| 出力バリデーション | Pydantic |
| DB | PostgreSQL |
| ORM | SQLAlchemy |
| トレース・ログ | MLflow |

---

## 対応する知識マップ項目

| 工程 | 習得できる知識マップ項目 |
|------|----------------------|
| 工程1：要件定義 | **オントロジー・意味設計要件**・**Human-in-the-loop要件**・RAG要件・ガードレール要件 |
| 工程2：基本設計 | **マルチエージェント設計**・**オーケストレーター設計**・ツール設計・LangGraph・埋め込みモデル・pgvector |
| 工程3：詳細設計 | **エージェントループ詳細設計**・**停止条件**・**Human-in-the-loop割り込みポイント**・状態管理・メモリ設計（短期） |
| 工程4：実装 | **マルチエージェント実装（LangGraph）**・**オーケストレーター実装**・ツール関数実装・RAGパイプライン実装・pgvector・MLflowトレース |
| 工程5：検証 | ガードレール検証（NGルール・在庫なし除外・同一商品再推薦防止） |
| 横断 | FastAPI・PostgreSQL・SQLAlchemy・Python |

---

## 対象外（スコープ外）

- 画面UI（フロントエンド）
- 決済・購入機能
- 在庫管理・受注管理
- 配送手配
- ラッピング・のし手配の自動化
