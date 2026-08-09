# StudyArchitecture

ソフトウェアアーキテクチャ・設計レビューの考え方を学ぶための個人学習用プロジェクトです。各テーマに要件定義・基本設計・詳細設計の文書と学習ノートを揃えています。

## 取り扱うテーマ

| 番号 | テーマ | 学習入口 | 最初の成果物 |
|------|--------|---|---|
| arch01 | システム構造のウォークスルー（system anatomy walkthrough） | [学習ノート](./doc/learning_notes/arch01_system_anatomy_walkthrough/README.md) | context・container・componentとrequest flow |
| arch02 | 証跡ベースの設計レビュー（evidence-driven design review） | [学習ノート](./doc/learning_notes/arch02_evidence_driven_design_review/README.md) | source付きfindingと残リスク |

## 15分で再開する

リポジトリルートで教材構造を確認し、`arch01`または`arch02`の学習ノートから記入例を1つ読みます。

```powershell
python category/StudyArchitecture\scripts\validate-architecture-learning.py
```

- 構造を説明したい場合は`arch01`を選ぶ。
- 設計上の問題やtest gapを指摘したい場合は`arch02`を選ぶ。
- repositoryで確認した事実と、設計意図に関する推測を混ぜない。

## 構成

```text
category/StudyArchitecture/
  doc/
    requirements/      要件定義
    basic_design/      基本設計
    detailed_design/   詳細設計
    learning_notes/    学習ノート
  scripts/             文書構造の自動検証
```

## 本リポジトリについて

- 個人の学習用に作成している実験的なプロジェクトです。
- 開発・整理には Claude Code / Codex などの AI コーディングアシストを活用しています。
- 学習目的のため、各テーマの粒度や完成度には差があります。

## 文書完結型テーマについて

`arch01` / `arch02` はいずれも、詳細設計の製造対象を**コードではなく文書**（`doc/learning_notes/` 配下のウォークスルー・レビュー教材）として定義した文書完結型テーマです。本プロジェクトに `src/` が無いのは意図した構成です。

コード実行の代わりに、入力、証拠、推測、判断、残リスクを追跡できる文書を完成させます。GitHub Actionsは教材ファイルと記入例の必須sectionを検証しますが、review内容の妥当性は学習者自身がsourceと照合します。
