# StudyDevOps devops01-devops10 基本設計インデックス

## 目的

DevOps 学習テーマを、製造可能な教材フォルダ構成、実行フロー、Docker/CI 方針へ整理する。

## 共通構成

```text
category/StudyDevOps/
  doc/
    requirements/
    basic_design/
    detailed_design/
    reviews/
  devopsXX_theme/
    README.md
    app/ or src/
    tests/
    docs/
    Dockerfile or docker-compose.yml
```

## 共通方針

- 実クラウドや本番環境ではなく、ローカル、Docker、GitHub Actions 教材例を中心にする。
- Docker に入れられるものは Dockerfile または docker-compose.yml を用意する。
- secrets、token、password、個人情報は教材データに含めない。
- 作成・更新するテキストファイルは UTF-8 BOMなしとする。

## 一覧

| No | 基本設計 | テーマ | 主な実装単位 |
|---|---|---|---|
| devops01 | `devops01_basic_design.md` | GitHub Actions build | workflow、app、Dockerfile |
| devops02 | `devops02_basic_design.md` | lint / unit test | package scripts、src、test、Dockerfile |
| devops03 | `devops03_basic_design.md` | API test | API server、HTTP test、compose |
| devops04 | `devops04_basic_design.md` | Playwright E2E | Web app、2E test、artifact |
| devops05 | `devops05_basic_design.md` | DB付きCI | PostgreSQL、schema、seed、test |
| devops06 | `devops06_basic_design.md` | request id付きログ | middleware、structured log、Docker logs |
| devops07 | `devops07_basic_design.md` | health check endpoint | health、ready、healthcheck |
| devops08 | `devops08_basic_design.md` | Docker logs調査 | compose、failure case、調査テンプレート |
| devops09 | `devops09_basic_design.md` | 障害調査Runbook | runbook、incident report、Docker checklist |
| devops10 | `devops10_basic_design.md` | Evidence-driven design review | 重複候補。正規ルートは `StudyArchitecture arch02` |

## 詳細設計で具体化すること

- workflow yaml
- package scripts
- Dockerfile / docker-compose.yml
- endpoint / response schema
- test case
- log format
- healthcheck command
- Runbook 項目
- 検証コマンド
- 設計レビュー証拠とfinding項目

## 後続工程

2026-05-07 に `category/StudyDevOps/doc/detailed_design/` へ `devops10` の詳細設計を追加した。ただし `devops10` は `StudyArchitecture arch02` と重複するため、教材実装の開始点にはしない。
