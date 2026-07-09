# 対象システム概要

## 対象

| 項目 | 値 |
| --- | --- |
| Study領域 | StudyWeb または StudyDevOps |
| 単元 | 小さな既存サンプル |
| 主目的 | user または operator から見える1つの動作を説明する |
| runtime | Docker、Node.js、Python、static files など観察できるもの |

## 境界

対象に含めるもの:

- entry point
- runtime service
- data dependency
- 対象動作の実行に必要な設定

対象外:

- 同じStudy folder内の無関係なsample
- 過去の実装メモ
- 現在のsystemから確認できない将来改善

## 最初の問い

どのuser操作またはoperator操作で、このsystemが動いていると証明できるか。
