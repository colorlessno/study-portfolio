# security11 ハッシュと署名 基本設計
## 0. 関連要件

- `../requirements/security11_hash_signature_requirements.md`

## 1. 設計目的
hash、password hash、署名の用途の違いを比較する。
## 2. 対象範囲

- hash計算
- password hashの説明
- HMAC署名
- 検証
- 用途比較
## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security11_webhook_signature/
  README.md
  app/
  docs/hash_signature_compare.md
  docs/password_hash_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| message | hash対象 |
| secret | 学習用ダミー署名鍵 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| hash | 入力のhash |
| signature | HMAC等の署名 |
| verification | 検証結果 |

## 6. 処理方針
1. hashを計算する
2. 署名を作る
3. 改ざん時に検証失敗することを確認する
4. password hashは専用アルゴリズムが必要と説明する
## 7. 確認観点

- hashを暗号化と混同していないか
- 署名の目的を説明できるか
- 実パスワードを扱っていないか

## 8. 後続工程への引き継ぎ

詳細設計では、入力、計算例、比較表、確認手順を定義する。
