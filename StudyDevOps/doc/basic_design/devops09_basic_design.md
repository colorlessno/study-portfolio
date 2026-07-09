# devops09 基本設計

## 障害調査Runbook

## 1. 設計目的

障害時の初動、影響確認、技術調査、一時対応、恒久対応、再発防止を Runbook として整理し、devops01 から devops08 の確認観点をつなぐ教材にする。

## 2. 配置方針

```text
StudyDevOps/
  src/apps/devops09_incident_runbook/
    docs/runbook.md
    docs/incident_report_template.md
    docs/docker_investigation_checklist.md
  doc/learning_notes/devops09_incident_runbook/
    README.md
```

- 実本番障害ではなく教材シナリオで扱う。
- Docker logs、health endpoint、recent change、CI result を確認順に含める。
- 作成・更新するテキストファイルは UTF-8 BOMなしとする。

## 3. 全体フロー

```text
incident received -> severity classify -> impact check -> health/log/CI review -> workaround -> permanent fix -> review
```

## 4. コンポーネント

| コンポーネント | 役割 |
|---|---|
| `src/apps/devops09_incident_runbook/docs/runbook.md` | 初動から収束までの確認順 |
| `src/apps/devops09_incident_runbook/docs/incident_report_template.md` | 影響、原因、対応、再発防止の記録 |
| `src/apps/devops09_incident_runbook/docs/docker_investigation_checklist.md` | Docker ps/logs/health の確認 |
| `doc/learning_notes/devops09_incident_runbook/README.md` | Runbook の使い方を説明する |

## 5. Docker / CI 方針

- devops08 の Docker logs 調査と接続する。
- devops01 から devops05 の CI/test 結果を Runbook の確認順に入れる。
- secret、個人情報、実顧客情報を記録しない。
- secrets は incident report、Runbook、Docker調査メモに記録しない。

## 6. 後続工程への引き継ぎ

詳細設計では、Runbook順、severity分類、チェックリスト、記録テンプレートを具体化する。
