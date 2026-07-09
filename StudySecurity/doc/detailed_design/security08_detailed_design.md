# security08 XSS対策 詳細設計
## 0. 関連文書

- `../requirements/security08_xss_requirements.md`
- `../basic_design/security08_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studysecurity/systems/security08_xss/
  README.md
  Dockerfile
  public/index.html
  public/app.js
  docs/escaping_rules.md
```

## 2. 主要設計
| 要素 | 内容 |
|---|---|
| 危険表示 | `innerHTML`利用時の問題を説明用に表示する |
| 安全表示 | `textContent`でユーザー入力を表示する |
| 属性値 | URLや属性に入れる場合の注意を記載する |
| CSP | 補助対策としての位置付けを示す |

## 3. 安全制約
- 外部サイトや実ブラウザ攻撃に使える手順にしない。
- サンプル入力はローカル画面内だけで扱う。
- エスケープとサニタイズを混同しない説明にする。
## 4. 確認手順
1. サンプル文字列を安全表示欄に入力する。
2. タグが文字として表示されることを確認する。
3. 危険表示との差分を読む。
4. READMEで文字別エスケープを確認する。
## 5. 完了条件

- 反射型、格納型、DOM型の違いを説明できる。
- `textContent`を使う理由を説明できる。
- CSPを主対策ではなく補助対策として説明できる。
