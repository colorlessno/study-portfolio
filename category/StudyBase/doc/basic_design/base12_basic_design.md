# base12 基本設計
## System anatomy walkthrough

## 0. 関連要件

- `../requirements/base12_system_anatomy_walkthrough_requirements.md`

## 1. 設計目的

既存システムを画面、API、DB、ログ、構成、障害時のふるまいから観察し、構成判断を証拠から説明する教材にする。

## 2. 正規ルートとの関係

このテーマの正規ルートは `StudyArchitecture arch01` とする。`base12` は `StudyBase` 側の重複候補として残し、詳細設計へ進める場合は `arch01` との重複を再確認する。

## 3. 対象範囲

- system anatomy
- component map
- data-flow map
- request / response observation
- DB state change
- failure mode
- decision note
- trade-off

## 4. 成果物構成

```text
category/StudyBase/
  doc/learning_notes/base12_system_anatomy_walkthrough/
    README.md
    docs/
      target_system_summary.md
      component_map.md
      request_flow.md
      failure_mode.md
      decision_notes.md
```

## 5. 入力

| 入力 | 内容 |
|---|---|
| 対象システム | 既存または実在相当の教材システム |
| 観察証拠 | 画面、API応答、DB状態、ログ、設定 |
| 操作シナリオ | 代表的な1操作 |
| 障害シナリオ | 失敗時の挙動と復旧手順 |

## 6. 出力

| 出力 | 内容 |
|---|---|
| component map | 画面、API、DB、外部連携、ジョブ、ログ |
| request flow | 入力からDB・ログまでの流れ |
| failure mode | 失敗時の挙動、復旧、再試行 |
| decision note | 構成判断と要件・制約の関係 |

## 7. 処理方針

1. 対象システムの目的、利用者、主要機能を整理する
2. 構成要素を地図化する
3. 代表操作を画面、API、DB、ログで追跡する
4. 失敗時のふるまいを整理する
5. 構成判断をdecision noteへ残す

## 8. 確認観点

- システムの構成要素と流れを説明できるか
- 観察証拠と推測を分けて記録できるか
- 構成判断と要件・制約の関係を説明できるか

## 9. 後続工程への引き継ぎ

詳細設計に進む場合は、先に `StudyArchitecture arch01` を正規ルートとして扱うか再確認する。

