# system03 プロジェクト文書の自然言語Q&A

プロジェクト文書を登録し、関連箇所を検索して根拠付きの回答を生成するRAG教材です。文書抽出、チャンキング、Embedding、キーワードとベクトルのハイブリッド検索、LLM回答、会話履歴、フィードバック記録を横断します。

最小のチャンキングテストはLLMなしで確認できます。システム全体の実行にはDocker、PostgreSQL (pgvector)、会話用LLM、Embeddingモデルが必要です。

| 段階 | 確認対象 | 外部依存 |
|---|---|---|
| 1. 最小観察 | Chunk生成、キーワード・ベクトル・ハイブリッドスコア | なし |
| 2. バックエンドテスト | 実装moduleの単体テスト | Python依存package |
| 3. 実アプリ | 文書登録、DB保存、検索、LLM回答、履歴 | Docker、PostgreSQL、Embedding、LLM |

## このテーマでできるようになること

- RAGにおける登録処理と質問処理の2つの流れを説明できる
- LLMとEmbeddingモデルの役割の違いを説明できる
- Chunk、metadata、検索スコア、回答根拠のつながりをコードで追える
- 外部モデルを使わず、チャンキングの単体テストから学習を再開できる
- 検索失敗と回答生成失敗を分けて考えられる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [System03 要件定義](../../requirements/system03_requirements.md) |
| 基本設計 | [System03 基本設計](../../basic_design/system03_basic_design.md) |
| 詳細設計 | [System03 詳細設計](../../detailed_design/system03_detailed_design.md) |
| バックエンド | [system03 実装](../../../src/backend/src/studyai/systems/system03/) |
| フロントエンド | [System03Page.tsx](../../../src/frontend/src/pages/System03Page.tsx) |
| 最小検証 | [validate-system03-rag-learning.py](../../../scripts/validate-system03-rag-learning.py) |
| テスト | [system03 tests](../../../src/backend/tests/systems/system03/) |

## 資料を見る前の確認問題

1. RAGでは、なぜ質問をそのままLLMへ送るだけでは不十分ですか。
2. 会話用LLMとEmbeddingモデルは、それぞれ何を担当しますか。
3. 文書をChunkに分ける大きさを変えると、検索結果にどのような影響がありますか。
4. 回答本文と一緒に根拠文書を返す理由は何ですか。

## 15分で再開する: 外部依存なし

リポジトリルートで、実アプリと同じChunk生成・検索スコアmoduleを動かします。API key、DB、外部packageは不要です。

```powershell
python category/StudyAI\scripts\validate-system03-rag-learning.py --show-output
```

実行前に、`runbook`、`semantic-only`、`unrelated`の順位を予想します。出力後は、キーワード40%・ベクトル60%が各候補の`hybrid_score`へどう反映されたかを説明します。

## 30分で単体テストする

バックエンドの依存関係が構築済みの場合は、チャンキングの単体テストを実行します。

```powershell
Set-Location category/StudyAI/src/backend
python -m pytest -q tests/systems/system03
```

Dockerを使う場合は、リポジトリの `StudyAI` フォルダでテスト用イメージから実行できます。

```powershell
Set-Location StudyAI
docker compose run --rm backend-test python -m pytest -q tests/systems/system03
```

テスト実行前に、入力がいくつのChunkへ分かれ、各Chunkにどの見出しが付くかを予想します。

## 45分でコードをたどる

### 文書登録

1. [`api/router.py`](../../../src/backend/src/studyai/systems/system03/api/router.py) の `POST /documents`
2. [`services/document_service.py`](../../../src/backend/src/studyai/systems/system03/services/document_service.py) のテキスト抽出、Chunk生成、Embedding取得
3. [`services/chunk_service.py`](../../../src/backend/src/studyai/systems/system03/services/chunk_service.py) の見出し検出、分割、overlap
4. [`repositories/document_repository.py`](../../../src/backend/src/studyai/systems/system03/repositories/document_repository.py) の保存処理

```text
ファイル → テキスト抽出 → セクション分割 → Chunk → Embedding → PostgreSQL / pgvector
```

### 質問と回答

1. [`api/router.py`](../../../src/backend/src/studyai/systems/system03/api/router.py) の `POST /ask`
2. [`services/ask_service.py`](../../../src/backend/src/studyai/systems/system03/services/ask_service.py) の候補取得、ランキング、回答生成
3. [`services/retrieval_scoring.py`](../../../src/backend/src/studyai/systems/system03/services/retrieval_scoring.py) のキーワード、ベクトル、ハイブリッドスコア
4. [`prompts/ask_prompt.py`](../../../src/backend/src/studyai/systems/system03/prompts/ask_prompt.py) の根拠の渡し方
5. `question_log_repository.py` と `session_repository.py` の記録処理

```text
質問 → 質問Embedding → 候補Chunk取得 → キーワード・ベクトル評価
     → 上位根拠をPromptへ追加 → LLM回答 → 根拠・履歴・評価を保存
```

## システム全体を動かす

LM Studio等で、会話用モデルとEmbeddingモデルをロードしてから起動します。モデル名と接続先は `category/StudyAI/src/backend/.env.docker` の設定を確認してください。

```powershell
Set-Location StudyAI
docker compose up -d db migrate system03 frontend
```

- System03 API: `http://localhost:18003`
- フロントエンド: `http://localhost:15173/system03`

確認後は、起動したサービスを停止します。

```powershell
docker compose stop system03 frontend
```

データベースも不要なら `docker compose down` を使います。Volumeを削除する `down -v` は学習データも消すため、目的を確認せず実行しません。

## 観察ポイント

- 文書の見出しが `section_title` としてChunkへ引き継がれる
- 長いセクションは `max_chars` と `overlap_chars` に従って分割される
- 検索順位はキーワードスコア40%、ベクトルスコア60%で計算される
- 関連候補がない場合は、LLMを呼ぶ前に `no_relevant_document` となる
- 回答と一緒に、文書名、セクション、抜粋が返される
- 質問、回答可否、フィードバックが後から分析できる形で保存される
- `access_roles`は文書へ保存されるが、現在の検索候補取得では権限filterに使われない。本番相当の認可済み実装ではない

## 壊して直す演習

1. 最小検証の `max_chars` と `overlap_chars` を変え、Chunk数を予想してから実行する。
2. 見出しの書式を変え、`HEADING_PATTERN` が認識する形式を確認する。
3. キーワードとベクトルの重みを合計1.0のまま変え、候補順位の変化を比較する。
4. 根拠候補が0件の場合と、Embedding APIが失敗した場合のエラー経路をコードで比較する。
5. `access_roles`を検索条件へ反映する場合に、request、query、testへ必要な変更を列挙する。

## 自分の言葉で説明する

- 文書登録と質問回答で、それぞれEmbeddingがいつ必要になるか
- Chunkを小さくしすぎる場合と大きくしすぎる場合の問題
- ハイブリッド検索がキーワード検索またはベクトル検索だけより有効になる場面
- LLMの回答を無条件に信用せず、根拠と評価ログを残す理由
- 本番利用時にアクセス制御、評価セット、監視、データ更新手順が必要な理由

## 学習完了の目安

- レベル1（再現）: 最小検証、チャンキングテスト、System03 APIのいずれかを実行できる
- レベル2（説明）: 登録と質問の2フロー、LLMとEmbeddingの役割を説明できる
- レベル3（改造）: Chunk設定、検索評価、Promptのいずれかを変更し、結果を比較できる
- レベル4（応用）: 別の文書検索課題に必要なmetadata、評価方法、権限制御を設計できる

関連テーマとして、[system22 RAG chunkサイズ比較](../../requirements/system22_requirements.md)、[system29 Chunk metadata設計](../../requirements/system29_requirements.md)、[system31 ground truth作成](../../requirements/system31_requirements.md)、[security18 RAG safety](../../../../StudySecurity/doc/learning_notes/security18_rag_safety/README.md)へ進みます。
