# StudyArchitecture

ソフトウェアアーキテクチャ・設計レビューの考え方を学ぶための個人学習用プロジェクトです。各テーマに要件定義・基本設計・詳細設計の文書と学習ノートを揃えています。

## 取り扱うテーマ

| 番号 | テーマ |
|------|--------|
| arch01 | システム構造のウォークスルー（system anatomy walkthrough） |
| arch02 | 証跡ベースの設計レビュー（evidence-driven design review） |

## 構成

```text
StudyArchitecture/
  doc/
    requirements/      要件定義
    basic_design/      基本設計
    detailed_design/   詳細設計
    learning_notes/    学習ノート
```

## 本リポジトリについて

- 個人の学習用に作成している実験的なプロジェクトです。
- 開発・整理には Claude Code / Codex などの AI コーディングアシストを活用しています。
- 学習目的のため、各テーマの粒度や完成度には差があります。
## 文書完結型テーマについて

`arch01` / `arch02` はいずれも、詳細設計の製造対象を**コードではなく文書**（`doc/learning_notes/` 配下のウォークスルー・レビュー教材）として定義した文書完結型テーマです。本プロジェクトに `src/` が無いのは意図した構成です。
