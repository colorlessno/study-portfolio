# security10 秘密情報管理

必須環境変数の有無を起動時に検証し、値を表示せずにfail fastするCLI教材です。動作確認は15分、漏洩対応とrotationを説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- secretをsource code、Git履歴、logから分離できる
- 必須設定の不足をapplication起動時に検出できる
- `.env.example`と実際のsecret storeの役割を区別できる
- 漏洩後に無効化・再発行が必要な理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [秘密情報管理 要件定義](../../requirements/security10_secret_management_requirements.md) |
| 基本設計 | [秘密情報管理 基本設計](../../basic_design/security10_basic_design.md) |
| 詳細設計 | [秘密情報管理 詳細設計](../../detailed_design/security10_detailed_design.md) |
| 補足 | [Secret rotation](./secret_rotation.md) |
| 実装 | [security10 ソース](../../../src/backend/src/studysecurity/systems/security10_secret_management/) |

## 資料を見る前の確認問題

1. `.gitignore`へ追加する前にcommitしたsecretは、現在のfileを消せば安全になりますか。
2. secretの値をerror logへ出してはいけないのはなぜですか。
3. rotationで新値を配る前に旧値を止めると何が起きますか。

## 15分で再開する

repository rootで次を実行します。

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security10_secret_management run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security10_secret_management run demo
$env:APP_SECRET = "example-app-secret"
$env:WEBHOOK_SECRET = "example-webhook-secret"
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security10_secret_management run demo
Remove-Item Env:APP_SECRET
Remove-Item Env:WEBHOOK_SECRET
```

1回目のdemoは不足した設定名と終了code 1、2回目は設定名と`values: masked`を表示します。`example-app-secret`等の値そのものが出力へ現れないことを確認します。

## コードを読む順番

1. [`.env.example`](../../../src/backend/src/studysecurity/systems/security10_secret_management/.env.example): 実値を置かないtemplateを見る
2. [`config.js`](../../../src/backend/src/studysecurity/systems/security10_secret_management/app/config.js): 必須項目とfail fastを追う
3. [`secret_rotation.md`](./secret_rotation.md): 漏洩・定期交換時の順序を確認する

## 観察ポイント

- 空文字も未設定として扱う
- errorは不足した設定名を示すが値は出さない
- environment variableに置けば自動的に安全になるわけではなく、process・deployment側のaccess制御が必要
- `.env.example`はschema共有用であり、secret配布用ではない

## 安全な改造課題

1. 必須ではない設定と必須secretを別の配列へ分ける。
2. 値を出さずにlengthや形式だけを検証する方針を設計する。
3. 新旧2つのkeyを一時的に受け付けるrotation期間を図にする。
4. 漏洩発見、無効化、再発行、影響調査、再発防止のchecklistを作る。

## 自分の言葉で説明する

- `.env.example`、local `.env`、production secret storeの違い
- Git履歴へ入ったsecretを交換すべき理由
- secretの保管、配布、利用、rotation、廃棄の各段階

## 学習用実装の制約

- `.env` fileの自動読込は行わない
- Secret ManagerやCI/CDへ接続しない
- 値の存在確認だけで、強度・権限・rotation状態は検証しない

## 学習完了の目安

- レベル1（再現）: 未設定失敗と設定済み成功を確認できる
- レベル2（説明）: 値をcode・Git・logへ出さない理由を説明できる
- レベル3（改造）: downtimeと漏洩期間を抑えるrotation手順を設計できる
