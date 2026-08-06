# StudySecurity

StudySecurity は、セッション認証、JWT、認可、入力検証、Web攻撃対策、監査ログ、AI安全対策、データ保持、PIIマスキングを学ぶための実装群です。

## 学習の入口

- [リポジトリ全体の学習再開ガイド](../LEARNING_GUIDE.md)
- [全テーマカタログ](../THEME_CATALOG.md)
- [security01 Session認証 学習ハブ](./doc/learning_notes/security01_session_auth/README.md)

## 構成

```text
StudySecurity/
  src/backend/src/studysecurity/systems/security01_session_auth/
  src/backend/src/studysecurity/systems/security20_pii_masking/
  doc/requirements/
  doc/basic_design/
  doc/detailed_design/
  doc/learning_notes/
  doc/reviews/
```

実装単位は `src/backend/src/studysecurity/systems/` に集約し、各番号のREADMEと補足資料は `doc/learning_notes/<securityXX_*>/` に配置しています。

## 実装一覧

- `security01_session_auth`
- `security02_jwt_auth`
- `security03_rbac`
- `security04_abac`
- `security05_input_validation`
- `security06_sql_injection`
- `security07_csrf`
- `security08_xss`
- `security09_file_upload`
- `security10_secret_management`
- `security11_webhook_signature`
- `security12_audit_log`
- `security13_rate_limit`
- `security14_cors`
- `security15_security_headers`
- `security16_dependency_management`
- `security17_prompt_injection`
- `security18_rag_safety`
- `security19_data_retention`
- `security20_pii_masking`
- `security21_ai_content_moderation`

## 実行例
```powershell
Set-Location .\src\backend\src\studysecurity\systems\security01_session_auth
npm.cmd run check
```

Docker 対応済みの番号は、各実装ディレクトリをビルドコンテキストにして確認します。
```powershell
docker build -t studysecurity-security01 .
docker run --rm studysecurity-security01
```

サーバーとして常駐する番号は、ポートを指定して起動し、確認後に停止します。
## security21 の構成について

`security21_ai_content_moderation` は、taxonomy・判定ケース表・監査ログスキーマ等の教材文書（`doc/learning_notes/security21_ai_content_moderation/`）を**ポリシー仕様**とし、それを実行形にした moderation 判定エンジンを実装しています。`npm run demo` で抽象ケース M-001〜M-006 の判定が期待値と一致するかを検証できます。入力は意図の抽象サマリのみで、不適切内容の本文は扱いません。
