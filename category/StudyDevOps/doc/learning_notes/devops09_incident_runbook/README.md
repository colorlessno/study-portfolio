# devops09 障害調査Runbook

目安: 25〜45分。devops06〜08で得たrequest ID、health、container status、ログを、初動判断から再発防止までの手順へつなぎます。

## このテーマでできるようになること

- 影響、技術的事実、仮説、判断を分けて記録する。
- severityに応じて共有と調査の優先順位を決める。
- restartやrollbackの前後で、証拠と回復条件を確認する。

## 成果物

- [要件定義](../../requirements/devops09_incident_runbook_requirements.md)
- [基本設計](../../basic_design/devops09_basic_design.md)
- [詳細設計](../../detailed_design/devops09_detailed_design.md)
- [Runbook](../../../src/apps/devops09_incident_runbook/docs/runbook.md)
- [障害報告テンプレート](../../../src/apps/devops09_incident_runbook/docs/incident_report_template.md)
- [Docker調査チェックリスト](../../../src/apps/devops09_incident_runbook/docs/docker_investigation_checklist.md)
- [記入例](../../../src/apps/devops09_incident_runbook/docs/sample_incident_report.md)

## 始める前に予想する

1. 「APIが500だった」は利用者影響と技術的事実のどちらか。
2. 原因不明のままrestartする場合、最低限何を保存すべきか。

## 15分で再開する

1. Runbookの「最初の10分」を読む。
2. 記入例を開き、事実・仮説・判断の欄を探す。
3. devops08の`app-runtime-error`を想定し、テンプレートへ5項目だけ記入する。
4. 記入例と比較し、抜けた確認を1つ記録する。

このテーマは実顧客の障害対応ではなく、固定されたローカル教材シナリオです。実際の連絡先や顧客情報は記入しません。

## 読む順番と観察点

1. Runbookで安全確認、影響、severity、証拠保全の順序を追う。
2. Docker checklistで値そのものを出さず、設定有無だけを確認する方法を見る。
3. incident templateのdecision logで「誰が・何を根拠に」を確認する。
4. sample reportで一時対応と恒久対応を区別する。

## 安全に改造する

記入例へ「readyは503、healthは200」という証拠を追加し、severityや対応判断が変わるか検討します。元の記入例は変更せず、手元の学習メモで比較します。

## 説明してみる

- Runbookがあっても判断者が必要なのはなぜか。
- 回復確認と原因特定を別の完了条件にする理由は何か。
- 再発防止を「注意する」だけで終わらせないため、何を自動化できるか。

## 完了条件

- [ ] 最初の10分の順序を説明した。
- [ ] テンプレートへ事実・仮説・判断を分けて記入した。
- [ ] 一時対応、恒久対応、再発防止を1件ずつ提案した。
