# security08 SQL Injection体験と対策 基本設計
## 0. 関連要件

- `../requirements/security08_sql_injection_requirements.md`

## 1. 設計目的
文字列連結SQLの危険性と、パラメータ化による対策を比較する。
## 2. 対象範囲

- 危険なSQL組み立て
- 安全なパラメータ化
- 攻撃入力例
- エラー情報隠蔽

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security08_xss/
  README.md
  app/
  docs/sql_injection_examples.md
  docs/defense_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| search text | 通常入力 |
| attack text | ローカル限定の攻撃文字列 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| unsafe query | 危険なSQL例 |
| safe query | パラメータ化例 |
| notes | 対策説明 |

## 6. 処理方針
1. 危険なSQL文字列を表示する
2. 攻撃入力で何が起きるか説明する
3. パラメータ化例を示す
4. 実DB攻撃は行わない
5. エラー詳細を利用者に出さない方針を示す
## 7. 確認観点

- 危険例と安全例がセットか
- 実システム攻撃につながらないローカル教材か
- パラメータ化の意味を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、疑似SQL、入力例、安全化例、確認手順を定義する。
