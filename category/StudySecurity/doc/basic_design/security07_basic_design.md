# security07 CSRF体験と対策 基本設計
## 0. 関連要件

- `../requirements/security07_csrf_requirements.md`

## 1. 設計目的
Cookie認証時の状態変更リクエストに対するCSRFリスクと対策を確認する。
## 2. 対象範囲

- Cookie自動送信
- 状態変更API
- SameSite
- CSRF token
- 攻撃ページ風サンプル

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security07_csrf/
  README.md
  app/
  docs/csrf_flow.md
  docs/defense_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| Cookie | 認証Cookie |
| state changing request | ダミー更新 |
| CSRF token | 対策用token |

## 5. 出力
| 出力 | 内容 |
|---|---|
| vulnerable result | tokenなし時の危険性 |
| protected result | tokenありの拒否・成功 |
| notes | SameSiteとtokenの説明 |

## 6. 処理方針
1. ダミーの状態変更APIを用意する
2. tokenなしの危険性を確認する
3. SameSiteの意味を確認する
4. CSRF tokenで検証する
5. 破壊的操作は行わない
## 7. 確認観点

- Cookie自動送信を説明できるか
- GETで状態変更していないか
- XSSとの違いを説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、API、token発行、検証、確認手順を定義する。
