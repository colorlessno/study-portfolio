# aws06 CloudWatch Logs

HTTPサーバーが出すJSON Linesログを使い、level、request ID、pathで1リクエストを追跡します。CloudWatch Logsへは送信しません。

## 到達目標

- ログevent、log stream、log group、保持期間の関係を説明できる。
- request IDで正常系と異常系を追跡できる。
- secretや個人情報をログへ残さない判断ができる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws06_cloudwatch_logs/)
- [ログ項目](docs/log_fields.md) / [障害確認表](docs/incident_checklist.md)
- [要件定義](../../requirements/aws06_cloudwatch_logs_requirements.md) / [基本設計](../../basic_design/aws06_basic_design.md) / [詳細設計](../../detailed_design/aws06_detailed_design.md)

## 15分で再開

```powershell
node category/StudyAWS\scripts\validate-studyaws.mjs aws06
```

検証は固定request IDで正常応答と500応答を発生させ、レスポンスとerrorログが同じIDで結び付くことを確認します。障害確認表へ「検知、対象request特定、原因候補、復旧確認」の順で記録します。

## 手を動かす課題

ログへ追加すべき項目を3つ、追加してはいけない項目を3つ選び、検索性、機密性、コストの観点で理由を書きます。

## 境界と完了条件

標準出力はCloudWatch Agent、Logs API、retention、metric filter、alarmを再現しません。実AWSでは保存期間と取り込み量の課金を確認します。1件の障害をrequest IDで説明できれば完了です。
