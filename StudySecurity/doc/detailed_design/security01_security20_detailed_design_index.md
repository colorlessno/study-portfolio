# StudySecurity security01-security20 詳細設計索引

## 1. 目的

StudySecurityの新規番号`security01`から`security20`について、製造に進めるための詳細設計を整理する。

## 2. 対象

| 番号 | テーマ | 詳細設計 |
|---|---|---|
| security01 | セッション認証 | `security01_detailed_design.md` |
| security02 | JWT認証 | `security02_detailed_design.md` |
| security03 | RBAC | `security03_detailed_design.md` |
| security04 | ABAC | `security04_detailed_design.md` |
| security05 | 入力検証 | `security05_detailed_design.md` |
| security06 | SQLインジェクション対策 | `security06_detailed_design.md` |
| security07 | CSRF対策 | `security07_detailed_design.md` |
| security08 | XSS対策 | `security08_detailed_design.md` |
| security09 | ファイルアップロード制御 | `security09_detailed_design.md` |
| security10 | 秘密情報管理 | `security10_detailed_design.md` |
| security11 | Webhook署名検証 | `security11_detailed_design.md` |
| security12 | 監査ログ | `security12_detailed_design.md` |
| security13 | レート制限 | `security13_detailed_design.md` |
| security14 | CORS設計 | `security14_detailed_design.md` |
| security15 | セキュリティヘッダー | `security15_detailed_design.md` |
| security16 | 依存関係管理 | `security16_detailed_design.md` |
| security17 | Prompt Injection対策 | `security17_detailed_design.md` |
| security18 | RAG安全対策 | `security18_detailed_design.md` |
| security19 | データ保持・削除 | `security19_detailed_design.md` |
| security20 | PIIマスキング | `security20_detailed_design.md` |

## 3. 製造方針

- 実装はローカル学習用の小さなサンプルに限定する。
- 実秘密情報、実個人情報、実破壊操作は扱わない。
- 攻撃例はローカル学習用途に限定し、対策例とセットにする。
- 外部サービスへの実攻撃、実操作、実送信は行わない。
- Dockerに入れられるサンプルは`Dockerfile`を製造対象に含める。

## 4. 次工程への引き継ぎ

- Node標準機能または静的HTML/JavaScriptを優先し、依存関係を増やさない。
- 製造時は各番号に`README.md`とDocker実行入口を置き、実行手順と確認観点を明記する。
- 実行できない設計論点は`docs/`配下に学習メモとして残す。
