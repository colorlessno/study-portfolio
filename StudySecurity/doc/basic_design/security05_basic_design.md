# security05 401 / 403 / 404 の使い分け 基本設計
## 0. 関連要件

- `../requirements/security05_401_403_404_requirements.md`

## 1. 設計目的
未認証、権限不足、未存在・存在秘匿をHTTP応答として使い分ける。
## 2. 対象範囲

- 401
- 403
- 404
- error body
- フロント表示

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security05_input_validation/
  README.md
  app/
  docs/status_decision_table.md
  docs/curl_check.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| auth state | 未ログイン・ログイン済み |
| role | 権限あり・なし |
| resource id | 存在・未存在・秘匿対象 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 未存在または存在秘匿 |

## 6. 処理方針
1. 未ログインで401を返す
2. 権限不足で403を返す
3. 未存在で404を返す
4. 秘匿方針の場合は404を返す
5. フロント表示を比較する
## 7. 確認観点

- 401/403/404の意味を説明できるか
- 内部情報を返していないか
- 存在秘匿の判断を文書化しているか
## 8. 後続工程への引き継ぎ

詳細設計では、判定表、API、エラーbody、確認手順を定義する。
