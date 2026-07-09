# base12 要件定義
## System anatomy walkthrough

## 1. 目的

既存または実在相当のシステムを、画面、API、DB、ログ、構成、障害時のふるまいから解剖し、要件・制約から構成判断を思いつけるようにする。

## 2. 学習対象

- system anatomy
- component map
- data-flow map
- request / response observation
- DB state change
- failure mode
- decision note
- trade-off

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 対象システムの目的、利用者、主要機能を整理する |
| FR-02 | 画面、API、DB、外部連携、ジョブ、ログの構成を地図化する |
| FR-03 | 1つの操作について入力からDB・ログまでの流れを追跡する |
| FR-04 | 失敗時のふるまいと復旧手順を整理する |
| FR-05 | なぜその構成が必要かを decision note として残す |

## 4. 非機能要件

- 設計項目の暗記ではなく、観察証拠から構成理由を説明する。
- 実秘密情報、実顧客情報、実障害情報を扱わない。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- 新規システムの本格実装
- 書籍内容の転載
- 企業秘密を含む実システム解析

## 6. 成果物

```text
StudyBase/
  doc/requirements/base12_system_anatomy_walkthrough_requirements.md
  doc/basic_design/base12_basic_design.md
  doc/detailed_design/base12_detailed_design.md
  doc/learning_notes/base12_system_anatomy_walkthrough/
```

## 7. 受入条件

- 1つのシステムを構成要素と流れで説明できる。
- 構成判断と要件・制約の関係を説明できる。
- Playwright、curl、DB確認、ログ確認の証拠を使って説明できる。
