# security04 ABAC 詳細設計
## 0. 関連文書

- `../requirements/security04_abac_requirements.md`
- `../basic_design/security04_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studysecurity/systems/security04_abac/
  README.md
  Dockerfile
  package.json
  app/server.js
  docs/policy_examples.md
```

## 2. 主要設計
| 要素 | 内容 |
|---|---|
| 属性 | ユーザー部署、注文担当部署、ステータスを扱う |
| ポリシー | 属性条件を関数として定義する |
| `GET /orders/:id` | 部署一致または管理者を許可する |
| `PATCH /orders/:id` | 担当部署かつ未確定のみ許可する |

## 3. 安全制約
- 属性はリクエスト本文から信用せず、サーバーのダミーデータから取得する。
- ポリシー条件と業務条件を分離して記録する。
- 実顧客データや実部署情報は扱わない。
## 4. 確認手順
1. 部署一致ユーザーが閲覧できることを確認する。
2. 部署不一致ユーザーが403になることを確認する。
3. 確定済み注文の更新が403になることを確認する。
4. 管理者の例外許可を確認する。
## 5. 完了条件

- RBACとABACの違いを説明できる。
- 属性の信頼境界を説明できる。
- ポリシー評価結果を再現できる。
