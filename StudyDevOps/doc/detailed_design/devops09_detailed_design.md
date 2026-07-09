# devops09 詳細設計

## 障害調査Runbook

## 1. 実装配置

```text
src/apps/devops09_incident_runbook/
  docs/runbook.md
  docs/incident_report_template.md
  docs/docker_investigation_checklist.md
doc/learning_notes/devops09_incident_runbook/
  README.md
```

## 2. Runbook構成

| 章 | 内容 |
|---|---|
| 初動 | 受付、影響、緊急度 |
| 状況確認 | health、logs、CI、recent change |
| 技術調査 | frontend、API、DB、Docker |
| 一時対応 | workaround、restart判断 |
| 恒久対応 | code/config修正 |
| 再発防止 | test、monitoring、手順修正 |

## 3. severity分類

| severity | 条件 | 対応 |
|---|---|---|
| S1 | 全停止、データ消失懸念 | 即時共有、暫定回避 |
| S2 | 主要機能停止 | 原因調査、回避策提示 |
| S3 | 一部機能の不具合 | 通常対応 |

## 4. Docker checklist

```text
docker compose ps
docker compose logs --tail 100 <service>
curl /health
curl /ready
recent image / env / compose diff
```

## 5. incident report template

| 項目 | 内容 |
|---|---|
| 概要 | 何が起きたか |
| 影響 | 誰に何が起きたか |
| 原因 | 技術原因 |
| 一時対応 | 実施した回避策 |
| 恒久対応 | 修正内容 |
| 再発防止 | 追加する test / Runbook |

## 6. 安全性

- secrets、個人情報、実顧客情報を記録しない。
- 障害メモに token、password、接続文字列を貼らない。
- テキストファイルは UTF-8 BOMなしで保存する。
