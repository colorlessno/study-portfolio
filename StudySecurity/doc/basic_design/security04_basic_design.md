# security04 owner_id / tenant_id 認可 基本設計
## 0. 関連要件

- `../requirements/security04_owner_tenant_authorization_requirements.md`

## 1. 設計目的
ログインユーザーが自分または自テナントのデータだけ扱えることを確認する。
## 2. 対象範囲

- owner_id
- tenant_id
- list filtering
- detail guard
- 403 / 404方針
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security04_abac/
  README.md
  app/
  docs/data_scope.md
  docs/access_check.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| user | userId, tenantId |
| resource id | 参照対象 |
| list request | 一覧取得 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| own data | 取得成功 |
| other data | 拒否または404 |
| scope log | 絞り込み条件 |

## 6. 処理方針
1. owner/tenant付きデータを用意する
2. 一覧で自分の範囲だけ返す
3. 詳細でもowner/tenantを確認する
4. 他人ID指定を拒否する
5. 403/404方針を記録する

## 7. 確認観点

- 一覧と詳細の両方で認可しているか
- ID推測で他人データが見えないか
- 403/404方針を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、データ構造、scope条件、拒否レスポンス、確認手順を定義する。
