# StudyDevOps devops01-devops10 要件定義インデックス

## 目的

CI/CD、テスト自動化、ログ調査、health check、Runbook を独立した学習分野として扱う。
StudyWeb、StudyAI、StudyAWS、StudySecurity の成果物を継続的に確認できる運用基礎を作る。

## 共通方針

- 実クラウドや本番環境ではなく、ローカル、Docker、GitHub Actions の教材例を中心にする。
- Docker に入れられるものは Dockerfile または docker-compose.yml を用意する。
- secrets、token、password、個人情報は教材データに含めない。
- 作成・更新するテキストファイルは UTF-8 BOMなしとする。

## 一覧

| No | ファイル | テーマ | 主な学習対象 |
|---|---|---|---|
| devops01 | `devops01_github_actions_build_requirements.md` | GitHub Actions build | workflow、build、CIログ |
| devops02 | `devops02_lint_unit_test_requirements.md` | lint / unit test | lint、unit test、品質ゲート |
| devops03 | `devops03_api_test_requirements.md` | API test | smoke、schema、status code |
| devops04 | `devops04_playwright_e2e_requirements.md` | Playwright E2E | browser test、trace、screenshot |
| devops05 | `devops05_db_ci_requirements.md` | DB付きCI | DB service、migration、seed、test |
| devops06 | `devops06_request_id_logging_requirements.md` | request id付きログ | trace id、structured log、Docker logs |
| devops07 | `devops07_health_check_endpoint_requirements.md` | health check endpoint | health、ready、Docker healthcheck |
| devops08 | `devops08_docker_logs_investigation_requirements.md` | Docker logs調査 | ps、logs、exec、切り分け |
| devops09 | `devops09_incident_runbook_requirements.md` | 障害調査Runbook | 初動、影響、暫定対応、再発防止 |
| devops10 | `devops10_evidence_driven_design_review_requirements.md` | Evidence-driven design review | 重複候補。正規ルートは `StudyArchitecture arch02` |

## 後続工程で具体化すること

- 2026-05-07 に、追加要件 `devops10` の基本設計と詳細設計を作成した。`devops10` は `StudyArchitecture arch02` と重複するため、教材実装の開始点にはしない。
- 教材実装へ進む場合は、正規ルートである `StudyArchitecture arch02` を優先する。
- 製造では、小さく実行できる教材実装と検証記録を作る。
