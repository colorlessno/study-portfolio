# StudySecurity

StudySecurity は、セッション認証、JWT、認可、入力検証、Web攻撃対策、監査ログ、AI安全対策、データ保持、PIIマスキングを学ぶための実装群です。

## 学習の入口

- [リポジトリ全体の学習再開ガイド](../LEARNING_GUIDE.md)
- [全テーマカタログ](../THEME_CATALOG.md)
- [security01 Session認証 学習ハブ](./doc/learning_notes/security01_session_auth/README.md)

最初は認証・認可の4テーマを順に進めます。

| テーマ | 学ぶ判断 | 確認URL |
|---|---|---|
| [security01 Session認証](./doc/learning_notes/security01_session_auth/README.md) | Cookieとサーバー側Sessionをどう結び付けるか | `http://localhost:4101` |
| [security02 JWT認証](./doc/learning_notes/security02_jwt_auth/README.md) | 署名と期限でtokenをどう検証するか | `http://localhost:4102` |
| [security03 RBAC](./doc/learning_notes/security03_rbac/README.md) | roleを操作権限へどう対応付けるか | `http://localhost:4103` |
| [security04 ABAC](./doc/learning_notes/security04_abac/README.md) | role以外の属性を認可条件へどう加えるか | `http://localhost:4104` |

この4テーマは、認証済みユーザーを本物の認証基盤で確立する一体型アプリではありません。各方式の判断点を小さく分離したローカル教材です。security03とsecurity04の`X-User`は、サーバー内の固定ユーザーを選ぶための学習用入力であり、本番の本人確認には使えません。

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
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security01_session_auth run check
```

Docker 対応済みの番号は、各実装ディレクトリをビルドコンテキストにして確認します。
```powershell
docker build -t studysecurity-security01 .
docker run --rm studysecurity-security01
```

サーバーとして常駐する番号は、各テーマREADMEに記載したポートで起動し、確認後に`Ctrl+C`で停止します。

## security21 の構成について

`security21_ai_content_moderation` は、taxonomy・判定ケース表・監査ログスキーマ等の教材文書（`doc/learning_notes/security21_ai_content_moderation/`）を**ポリシー仕様**とし、それを実行形にした moderation 判定エンジンを実装しています。`npm run demo` で抽象ケース M-001〜M-006 の判定が期待値と一致するかを検証できます。入力は意図の抽象サマリのみで、不適切内容の本文は扱いません。
