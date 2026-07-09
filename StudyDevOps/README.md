# StudyDevOps

CI/CD、テスト自動化、コンテナ運用、ログ・監視、インシデント対応といった **DevOps の基礎を、要件定義 → 基本設計 → 詳細設計 → 製造の流れで実践しながら学ぶ**ための、個人学習用プロジェクトです。`devops01` 〜 の題材ごとに各工程の成果物（設計文書とコード）を揃えています。

## 本リポジトリについて

- 個人の学習用に開発している実験的なプロジェクトです。DevOps の各テーマを、設計から実装・確認まで一通り体験・記録することを目的にしています。
- 開発には **Claude Code / Codex などの AI コーディングアシストを活用**しています。
- 各テーマの完成度には差があります。

## 取り扱うテーマ

| 番号 | テーマ |
|------|--------|
| devops01 | GitHub Actions によるビルド |
| devops02 | Lint / ユニットテスト |
| devops03 | API テスト |
| devops04 | Playwright による E2E テスト |
| devops05 | DB を含む CI |
| devops06 | request id ロギング |
| devops07 | ヘルスチェックエンドポイント |
| devops08 | Docker ログ調査 |
| devops09 | インシデント runbook |
| devops10 | 証跡ベースの設計レビュー |

## 構成

```text
StudyDevOps/
  src/apps/            各テーマの実装（devops01〜）
  doc/
    requirements/      各テーマの要件定義
    basic_design/      基本設計
    detailed_design/   詳細設計
    learning_notes/    各テーマの README・学習ノート
```

各テーマは「要件定義 → 基本設計 → 詳細設計 → 製造」を一通り辿れるよう、`doc/` に工程別の成果物を、`src/apps/` に実装を配置しています。

## 技術スタック

- Node.js / TypeScript / JavaScript
- GitHub Actions（CI）
- Playwright（E2E テスト）
- Docker / Docker Compose
- PostgreSQL（CI でのDB利用）

## 補足

- `node_modules`、`.env`（`.env.example` を除く）、テスト生成物などは `.gitignore` で除外しています。
- 学習目的のため、設計文書とコードの粒度や完成度はテーマごとに異なります。
## 文書完結型・重複テーマについて

`devops10` は正規ルートを `StudyArchitecture arch02` とする重複テーマのため、詳細設計のみ残し、教材成果物は意図的に作成していません。
