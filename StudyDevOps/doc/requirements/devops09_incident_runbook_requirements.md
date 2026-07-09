# devops09 要件定義

## 障害調査Runbook

## 1. 目的

障害時に何を見るか、どの順序で確認するか、誰に何を伝えるかを Runbook として整理し、属人的な調査を減らす方法を学ぶ。

## 2. 学習対象

- incident triage
- severity / impact / workaround
- logs、health、metrics、recent change の確認順
- Docker Compose、Docker logs、container status の確認順
- rollback / restart の判断材料
- 事後レビューの観点

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 障害受付テンプレートを用意する |
| FR-02 | 初動確認チェックリストを用意する |
| FR-03 | API 障害、DB 障害、frontend 障害の確認手順を分ける |
| FR-04 | 一時対応、恒久対応、再発防止の記録欄を用意する |
| FR-05 | devops01 から devops08 の確認観点を Runbook に接続する |
| FR-06 | Docker logs、compose ps、health endpoint の確認欄を用意する |

## 4. 非機能要件

- 責任者不在のまま作業しないよう役割と判断者を明記する。
- 秘密情報、個人情報、実顧客情報を記録しない。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- 本番障害対応の組織ルール策定
- SLA 契約文書
- 監視サービスの本格設定

## 6. 成果物

```text
StudyDevOps/
  src/apps/devops09_incident_runbook/
    docs/runbook.md
    docs/incident_report_template.md
    docs/docker_investigation_checklist.md
  doc/learning_notes/devops09_incident_runbook/README.md
  doc/requirements/devops09_incident_runbook_requirements.md
```

## 7. 受入条件

- 障害発生時の初動確認順を説明できる。
- 技術調査結果とユーザー影響を分けて記録できる。
- 一時対応、恒久対応、再発防止を分けて整理できる。
