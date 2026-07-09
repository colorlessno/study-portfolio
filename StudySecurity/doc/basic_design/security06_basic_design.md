# security06 XSS体験と対策 基本設計
## 0. 関連要件

- `../requirements/security06_xss_requirements.md`

## 1. 設計目的
危険なHTML表示と安全なテキスト表示を比較し、XSS対策を学ぶ。
## 2. 対象範囲

- `innerHTML`
- `textContent`
- 攻撃文字列
- 保存済み表示
- 対策メモ

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security06_sql_injection/
  README.md
  app/
  docs/xss_payloads.md
  docs/defense_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| user text | 学習用入力 |
| payload | ローカル限定の危険文字列 |

## 5. 出力
| 出力 | 内容 |
|---|---|
| unsafe view | 危険表示 |
| safe view | 安全表示 |
| notes | 対策説明 |

## 6. 処理方針
1. 危険な表示例をローカルで確認する
2. 安全な表示例と比較する
3. 防御策を必ず併記する
4. 外部送信や実害のあるpayloadは扱わない
## 7. 確認観点

- 危険例だけで終わっていないか
- `innerHTML`の危険性を説明できるか
- 出力時対策を説明できるか
## 8. 後続工程への引き継ぎ

詳細設計では、payload、画面構成、安全表示方式、確認手順を定義する。
