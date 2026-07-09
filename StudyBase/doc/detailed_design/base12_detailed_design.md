# base12 詳細設計
## System anatomy walkthrough

## 0. 関連文書

- `../requirements/base12_system_anatomy_walkthrough_requirements.md`
- `../basic_design/base12_basic_design.md`

## 1. 正規ルートとの関係

このテーマの正規ルートは `StudyArchitecture arch01` である。`base12` は `StudyBase` 側の重複候補として詳細設計を残すが、教材実装の開始点にはしない。

## 2. 製造対象

```text
doc/learning_notes/base12_system_anatomy_walkthrough/
  README.md
  docs/
    target_system_summary.md
    component_map.md
    request_flow.md
    failure_mode.md
    decision_notes.md
```

## 3. テンプレート設計

| ファイル | 内容 |
|---|---|
| `target_system_summary.md` | 目的、利用者、主要機能、制約 |
| `component_map.md` | 画面、API、DB、外部連携、ジョブ、ログ |
| `request_flow.md` | 代表操作の入力からDB・ログまで |
| `failure_mode.md` | 失敗時のふるまい、復旧、再試行 |
| `decision_notes.md` | 構成判断、証拠、trade-off |

## 4. 確認手順

1. `StudyArchitecture arch01` の詳細設計を正規テンプレートとして確認する
2. base12側で扱う場合の差分だけを記録する
3. 代表操作のrequest flowを作る
4. failure modeとdecision noteを作る
5. `arch01` と重複していないか確認する

## 5. 完了条件

- システムの構成要素と流れを説明できる
- 観察証拠と推測を分けて記録できる
- `StudyArchitecture arch01` との関係を説明できる

## 6. 安全性

- 実秘密情報、実顧客情報、実障害情報を扱わない
- 正規ルートを変更しない限り、教材実装は `arch01` から開始する
- 書籍内容の転載や実企業システム解析は行わない

