# security12 監査ログ

重要操作の成功・拒否をJSON Linesで出力し、追跡可能性とsecret・PIIのmaskを学ぶCLI教材です。出力確認は15分、本番の保存・検索・改ざん耐性を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- actor、action、target、result、reason、requestIdを構造化できる
- application logとaudit logの目的を区別できる
- successだけでなくdenied eventを残す理由を説明できる
- 調査に必要な情報を残しながらsecret・PIIをmaskできる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [監査ログ 要件定義](../../requirements/security12_audit_log_requirements.md) |
| 基本設計 | [監査ログ 基本設計](../../basic_design/security12_basic_design.md) |
| 詳細設計 | [監査ログ 詳細設計](../../detailed_design/security12_detailed_design.md) |
| 補足 | [Audit events](./audit_events.md) |
| 実装 | [security12 ソース](../../../src/backend/src/studysecurity/systems/security12_audit_log/) |

## 資料を見る前の確認問題

1. 認可拒否を記録しないと、どのような調査が難しくなりますか。
2. request body全体を保存すれば調査しやすくなりますが、何が問題ですか。
3. local fileへ出力するだけで改ざん耐性があると言えますか。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security12_audit_log run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security12_audit_log run demo
```

2行のJSONを確認し、1行目は成功、2行目は拒否であること、`demo@example.com`と`example-api-token`がそれぞれ`[email]`と`[secret]`へ変わることを確認します。

## コードを読む順番

1. [`audit_events.md`](./audit_events.md): event schemaを確認する
2. [`demo.js`](../../../src/backend/src/studysecurity/systems/security12_audit_log/app/demo.js): successとdeniedの入力を見る
3. [`audit_logger.js`](../../../src/backend/src/studysecurity/systems/security12_audit_log/app/audit_logger.js): schema固定、mask、JSON Lines出力を追う

## 観察ポイント

- `at`はUTCのISO 8601で生成する
- maskをreasonだけでなく全ての文字列項目へ適用する
- requestIdはservice間で同じ追跡IDを渡すと有効になる
- mask済みでもaccess権限・保持期間・削除方針は必要
- log出力の成功と業務transactionの成功は別問題

## 安全な改造課題

1. event typeとschema versionを追加する。
2. fieldごとのallowlistで、想定外項目をlogへ出さないようにする。
3. 同じrequestIdの複数eventを時系列へ並べるviewerを設計する。
4. append-only storage、署名、権限分離のどれが改ざん耐性へ効くか整理する。

## 自分の言葉で説明する

- audit log、access log、debug logの違い
- denied eventと変更前後の値をどこまで残すか
- 調査可能性、privacy、保存costのtrade-off

## 学習用実装の制約

- 標準出力だけで永続化・検索を行わない
- mask対象はemailと`example-`形式のdummy secretだけ
- 改ざん防止、access制御、保持期間を実装しない

## 学習完了の目安

- レベル1（再現）: 2 eventをJSON Linesとして確認できる
- レベル2（説明）: 必須項目、mask、requestIdの役割を説明できる
- レベル3（改造）: production監査基盤の保存・検索・保護を設計できる
