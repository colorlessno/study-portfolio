# arch01 詳細設計
## System anatomy walkthrough

## 0. 関連文書

- `../requirements/arch01_system_anatomy_walkthrough_requirements.md`
- `../basic_design/arch01_basic_design.md`

## 1. 製造対象

```text
doc/learning_notes/arch01_system_anatomy_walkthrough/
  README.md
  docs/
    target_system_summary.md
    context_container_component.md
    request_data_flow.md
    failure_mode.md
    decision_notes.md
    evidence_vs_inference.md
```

## 2. 対象システム選定基準

| 条件 | 内容 |
|---|---|
| 教材性 | 画面、API、DB、ログ、設定のうち複数を観察できる |
| 安全性 | 実秘密情報、実個人情報、実障害情報を含まない |
| 再現性 | ローカルまたは既存Study成果物として再確認できる |
| 粒度 | 代表操作1つを追跡できる規模に限定する |

候補は既存 `StudyWeb`、`StudyDevOps`、`StudyAI` の小さい教材システムを優先する。

## 3. system summary テンプレート

| 項目 | 内容 |
|---|---|
| system name | 対象システム名 |
| purpose | 何を解決するシステムか |
| users | 主な利用者 |
| main use cases | 代表操作 |
| constraints | 運用、セキュリティ、性能、復旧制約 |
| out of scope | 今回観察しない範囲 |

## 4. context / container / component 設計

| view | 記録項目 |
|---|---|
| context | 利用者、外部システム、対象システム境界 |
| container | frontend、backend、DB、worker、external service |
| component | endpoint、service、repository、job、loggerなど |

図を作れない場合はMarkdown表で表現する。

## 5. request / data flow テンプレート

| step | layer | evidence | state change | note |
|---|---|---|---|---|
| 1 | UI | screenshot / DOM / route | 入力値 | 代表操作の開始 |
| 2 | API | method、path、status、body | request id | API境界 |
| 3 | service | log、function名 | validation結果 | 業務処理 |
| 4 | DB | table、row、query | insert/update/delete | 状態変化 |
| 5 | response | status、body、画面表示 | 結果表示 | 利用者への戻り |

## 6. failure mode テンプレート

| failure | trigger | observed behavior | recovery | design note |
|---|---|---|---|---|
| validation error | 不正入力 | 400 / error message | 入力修正 | UI/API両方で扱う |
| DB unavailable | DB停止 | 500 / health fail | 再起動、retry | readinessで検出 |
| duplicate request | 二重送信 | idempotency / conflict | 再確認 | 業務整合性 |

## 7. decision note 設計

| 項目 | 内容 |
|---|---|
| decision | 採用されている構成判断 |
| evidence | 判断を推測した証拠 |
| requirement / constraint | その判断を必要にする要件・制約 |
| trade-off | 得るもの、失うもの |
| confidence | evidence、inference、unknown の区分 |

## 8. 確認手順

1. 対象システムと代表操作を選ぶ
2. system summaryを作る
3. context / container / componentを表にする
4. 代表操作のrequest / data flowを追う
5. failure modeを1つ以上整理する
6. decision noteで構成判断を記録する
7. evidenceとinferenceを分けて見直す

## 9. 完了条件

- システムの構成要素とデータの流れを説明できる
- 構成判断と要件・制約の関係を説明できる
- 証拠と推測を分けて記録できる

## 10. 安全性

- 実企業秘密、実個人情報、実障害情報を扱わない
- 既存Study成果物を題材にしてよいが、観察だけを基本とする
- 推測は推測として明記し、断定しない

