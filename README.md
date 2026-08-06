# 学習・開発ポートフォリオ

AIコーディング支援を活用して作成したソースを、実際に読み、動かし、変更し、自分の知識へ変えていくための学習ポートフォリオです。163の番号付きテーマを通して、ソフトウェア開発を「要件定義 → 基本設計 → 詳細設計 → 製造 → 検証」の一連の工程（SDLC）で扱っています。

## 2つの入口

| 目的 | 最初に見る場所 |
|---|---|
| 成果物や技術力を短時間で確認する | 下の「代表成果」と「プロジェクト一覧」 |
| 学習を再開し、手を動かす | [学習再開ガイド](./LEARNING_GUIDE.md) → [テーマカタログ](./THEME_CATALOG.md) |

学習記録を残す場合は [学習ログテンプレート](./LEARNING_LOG_TEMPLATE.md) を使います。

## 代表成果

### StudyAI system03: プロジェクト文書の自然言語Q&A

文書登録、チャンキング、Embedding、ハイブリッド検索、根拠付き回答、フィードバック記録を扱うRAGシステムです。要件、設計、FastAPI実装、React画面、pytestを横断できます。

- [学習ハブ](./StudyAI/doc/learning_notes/system03_project_document_qa/README.md)
- [要件定義](./StudyAI/doc/requirements/system03_requirements.md)
- [バックエンド実装](./StudyAI/src/backend/src/studyai/systems/system03/)
- [テスト](./StudyAI/src/backend/tests/systems/system03/test_chunk_service.py)

### StudyFabel / IdeaForge

発想法をグラフとして組み立て、AIの生成結果を人間が採用・修正・再生成しながら案を育てるローカルWebアプリです。

- [プロジェクト概要](./StudyFabel/)
- [アプリケーション](./StudyFabel/ideaforge/)

### 小さく学べる教材

- [web01: HTML / CSS / JavaScriptの役割分担](./StudyWeb/doc/learning_notes/web01_static_first_page/README.md)
- [security01: Cookie + Session認証](./StudySecurity/doc/learning_notes/security01_session_auth/README.md)

## 学習方針

完成したコードを読むだけでなく、次のサイクルで理解を確認します。

```text
思い出す → 動かす → コードをたどる → 壊して直す → 自分の言葉で説明する
```

到達度は「再現できる」「説明できる」「改造できる」「応用できる」で記録します。詳しい進め方は [学習再開ガイド](./LEARNING_GUIDE.md) にまとめています。

## プロジェクト一覧

### 実装まで一周した主要プロジェクト

| プロジェクト | 内容 | 主な技術 |
|---|---|---|
| [StudyAI](./StudyAI/) | AIを組み込んだ業務システム群（system01〜48）。データ抽出、RAG、エージェント等 | Python / FastAPI / PostgreSQL (pgvector) / LangGraph / React / Docker |
| [StudyWeb](./StudyWeb/) | Web開発の体系学習（web01〜52）。静的ページからNext.js、Prisma、Compose構成まで | TypeScript / React / Next.js / NestJS / Prisma / Docker |
| [StudySecurity](./StudySecurity/) | セキュリティ実装教材（security01〜21）。認証、認可、Web攻撃対策、AI安全 | Node.js（依存ゼロ実装） |
| [StudyDevOps](./StudyDevOps/) | CI/CD、テスト、ログ、運用、障害対応の教材 | GitHub Actions / Playwright / Docker |
| [StudyAWS](./StudyAWS/) | AWSの主要概念をローカルで模擬する教材（aws01〜10） | Node.js / Docker |
| [StudyFabel](./StudyFabel/) | IdeaForge — AIと人間の協働による発想支援Webアプリ | FastAPI / SQLite / React / Vite |

### 学習ノート・設計中心のプロジェクト

| プロジェクト | 内容 |
|---|---|
| [StudyDB](./StudyDB/) | データベース教材（SQL実習と設計文書） |
| [StudyBase](./StudyBase/) | 開発の基礎作法（ヒアリング、見積、Git、npm等） |
| [StudyArchitecture](./StudyArchitecture/) | アーキテクチャ分析・設計レビューの文書教材 |
| [StudyDesktop](./StudyDesktop/) | Electronによるデスクトップアプリ教材 |
| [StudyAIIdeaGeneration](./StudyAIIdeaGeneration/) | AI発想支援のプロンプト集 |
| [StudyAICorporateEmployee](./StudyAICorporateEmployee/) | ローカルPC上に役割別「AI社員」を構築する設計メモ |

## リポジトリ構成

各プロジェクトでは、工程別の文書と実装を対応付けています。

```text
StudyXX/
  doc/requirements/       要件定義
  doc/basic_design/       基本設計
  doc/detailed_design/    詳細設計
  doc/learning_notes/     テーマごとの学習入口
  src/                    実装、SQL、テンプレート等
```

一部のテーマは、コードではなくチェックリスト、設計レビュー、運用手順などを成果物とする「文書完結型」です。

## AIコーディング支援について

- Claude CodeやCodexなどを、初期実装、調査、レビュー、修正支援に利用しています。
- AIが生成した内容をそのまま理解済みとは扱わず、実行、差分確認、テスト、説明、改造を通して検証します。
- 実行していない内容を検証済みとして記録しない方針です。

## 検証

ルートから次のコマンドを実行すると、公開文書のリンク、テキストファイルのUTF-8、学習カタログのテーマ数を確認できます。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate_portfolio.ps1
```

PowerShell 7 (`pwsh`) を使用する場合は、`pwsh -File scripts/validate_portfolio.ps1` でも実行できます。

`docker-compose.yml` 等に含まれる `postgres / postgres` などの接続情報は、ローカル学習用の慣例的なデフォルト値です。環境変数（`POSTGRES_PASSWORD` / `DATABASE_URL` 等）で上書きできます。本番用途では必ず変更してください。
