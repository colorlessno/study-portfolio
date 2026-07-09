# security09 ファイルアップロード制御 詳細設計
## 0. 関連文書

- `../requirements/security09_file_upload_requirements.md`
- `../basic_design/security09_basic_design.md`

## 1. 製造対象

```text
src/backend/src/studysecurity/systems/security09_file_upload/
  README.md
  Dockerfile
  public/index.html
  public/app.js
  docs/upload_policy.md
```

## 2. 主要設計
| 要素 | 内容 |
|---|---|
| 拡張子 | 許可リスト方式で検証する |
| MIME | ブラウザ申告値は参考情報として扱う |
| サイズ | 上限を超えるファイルを拒否する |
| 保存名 | 元ファイル名を保存名に使わない設計を説明する |

## 3. 安全制約
- 実ファイルをサーバに保存しない。
- ファイル内容の完全判定は扱わず、境界と限界を明記する。
- 実マルウェアや危険ファイルは使わない。
## 4. 確認手順
1. 許可拡張子のファイル名を入力して許可されることを確認する。
2. 禁止拡張子が拒否されることを確認する。
3. サイズ超過が拒否されることを確認する。
4. MIMEだけでは信用できない理由を読む。
## 5. 完了条件

- 拡張子、MIME、内容検査の役割を説明できる。
- 保存名を再生成する理由を説明できる。
- アップロード処理のリスク境界を説明できる。
