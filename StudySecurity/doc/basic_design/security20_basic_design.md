# security20 PIIマスキング 基本設計
## 0. 関連要件

- `../requirements/security20_pii_masking_requirements.md`

## 1. 設計目的
ログやAI入力前に、メールアドレスや電話番号などのPIIをマスキングする。
## 2. 対象範囲

- PII detection
- masking
- log sanitization
- AI input preprocessing
- 検出限界

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security20_pii_masking/
  README.md
  app/
  docs/pii_rules.md
  docs/masking_examples.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| text | ダミー個人情報を含む文書 |
| rules | メール、電話番号など |

## 5. 出力
| 出力 | 内容 |
|---|---|
| masked text | PIIを伏せた文章 |
| before/after | 比較 |
| notes | 限界と注意 |

## 6. 処理方針
1. ダミーPIIを含む文書を入力する
2. ルールでPIIを検出する
3. マスキングして出力する
4. ログとAI入力での使い方を説明する
5. 正規表現の限界を明記する
## 7. 確認観点

- 実個人情報を使っていないか
- マスキング前後を比較できるか
- 検出漏れと過剰マスキングのリスクを説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、検出ルール、置換形式、サンプル入力、確認手順を定義する。
