# web52 要件定義
## Modern web rendering comparison

## 1. 目的

MPA、SPA、SSR、SSG、Server Components、Islands Architecture、PWA の違いを比較し、要件に応じてWeb表示方式を選ぶ判断軸を学ぶ。

## 2. 学習対象

- MPA
- SPA
- SSR
- SSG
- Server Components
- Islands Architecture
- PWA
- hydration
- routing and data fetching

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 各表示方式の特徴を表で比較する |
| FR-02 | 同じ一覧画面を複数方式で考えた場合の違いを整理する |
| FR-03 | SEO、初期表示、操作性、開発複雑性、運用の観点を比較する |
| FR-04 | API取得、キャッシュ、認証との関係を整理する |
| FR-05 | StudyWeb既存テーマとの対応を示す |

## 4. 非機能要件

- 流行語の暗記ではなく、要件に対する選定理由を重視する。
- 特定フレームワークの全面移行は行わない。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- フレームワーク性能ベンチマーク
- 本格PWA実装
- 大規模SSR運用

## 6. 成果物

```text
category/StudyWeb/
  doc/requirements/web52_modern_rendering_comparison_requirements.md
  doc/basic_design/web52_basic_design.md
  doc/detailed_design/web52_detailed_design.md
  doc/learning_notes/web52_modern_rendering_comparison/
```

## 7. 受入条件

- MPA、SPA、SSR、SSG の違いを説明できる。
- 要件に応じた表示方式選定理由を説明できる。
- 既存 StudyWeb テーマとの関係を説明できる。
