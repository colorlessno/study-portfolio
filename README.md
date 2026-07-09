# 学習・開発ポートフォリオ

ソフトウェア開発を「要件定義 → 基本設計 → 詳細設計 → 製造 → 検証」の一連の工程（SDLC）で実践しながら学んだ成果物集です。各プロジェクトは題材ごとに工程文書と実装をセットで揃えることを方針としています。

## プロジェクト一覧

### 実装まで一周した主要プロジェクト

| プロジェクト | 内容 | 主な技術 |
|---|---|---|
| [StudyAI](./StudyAI/) | AI を組み込んだ業務システム群（system01〜48）。データ抽出・RAG・エージェント等 | Python / FastAPI / PostgreSQL(pgvector) / LangGraph / React / Docker |
| [StudyWeb](./StudyWeb/) | Web 開発の体系学習（web01〜52）。静的ページから Next.js / Prisma / compose 構成まで | TypeScript / React / Next.js / NestJS / Prisma / Docker |
| [StudySecurity](./StudySecurity/) | セキュリティ実装教材（security01〜21）。認証・認可・Web攻撃対策・AI安全 | Node.js（依存ゼロ実装） |
| [StudyDevOps](./StudyDevOps/) | CI/CD・テスト・運用の教材（devops01〜09） | GitHub Actions / Playwright / Docker |
| [StudyAWS](./StudyAWS/) | AWS の主要概念をローカルで模擬する教材（aws01〜10） | Node.js / Docker |
| [StudyFabel](./StudyFabel/) | ideaforge — 発想法をグラフ化し AI と人間の協働で案を鍛える発想支援 Web アプリ | FastAPI / SQLite / React / Vite |

### 学習ノート・設計中心のプロジェクト

| プロジェクト | 内容 |
|---|---|
| [StudyDB](./StudyDB/) | データベース教材（SQL 実習 + 設計文書） |
| [StudyBase](./StudyBase/) | 開発の基礎作法（ヒアリング・見積・Git・npm 等） |
| [StudyArchitecture](./StudyArchitecture/) | アーキテクチャ分析・設計レビューの文書教材 |
| [StudyDesktop](./StudyDesktop/) | Electron によるデスクトップアプリ教材 |
| [StudyAIIdeaGeneration](./StudyAIIdeaGeneration/) | AI 発想支援のプロンプト集 |
| [StudyAICorporateEmployee](./StudyAICorporateEmployee/) | ローカル PC 上に役割別「AI 社員」を構築する設計メモ |

## 読み方のガイド

- 各プロジェクトの `doc/requirements` / `doc/basic_design` / `doc/detailed_design` に工程文書、`src/` に実装があります。
- 一部のテーマは「文書完結型」（詳細設計の製造対象が文書）です。各プロジェクトの README に明示しています。
- テーマごとの成果物有無の一覧は各プロジェクト README を参照してください。

## 開発について

- 個人の学習用に開発した実験的なプロジェクト群です。
- 開発には Claude Code / Codex などの AI コーディングアシストを活用しています。
- `docker-compose.yml` 等に含まれる `postgres / postgres` などの接続情報は、ローカル学習用の慣例的なデフォルト値です。環境変数（`POSTGRES_PASSWORD` / `DATABASE_URL` 等）で上書きできます。本番用途では必ず変更してください。
