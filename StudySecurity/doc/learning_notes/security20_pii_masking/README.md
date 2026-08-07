# security20 PIIマスキング

dummyのemail、電話番号、顧客IDを種別labelへ置換し、log・AI入力の前処理と検出限界を学ぶCLI教材です。実個人情報は使いません。置換確認は15分、productionのprivacy boundaryを説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- raw inputをlogへ出す前にPIIをmaskできる
- redaction、masking、tokenization、削除を区別できる
- 検出漏れと過剰maskの両方をtest観点にできる
- AI入力・出力・trace・auditの各保存先を点検できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [PII masking 要件定義](../../requirements/security20_pii_masking_requirements.md) |
| 基本設計 | [PII masking 基本設計](../../basic_design/security20_basic_design.md) |
| 詳細設計 | [PII masking 詳細設計](../../detailed_design/security20_detailed_design.md) |
| 補足 | [Masking policy](./masking_policy.md) |
| 実装 | [security20 ソース](../../../src/backend/src/studysecurity/systems/security20_pii_masking/) |

## 資料を見る前の確認問題

1. 正規表現に一致しない表記のPIIはどうなりますか。
2. 全ての数字をmaskすると、どのような業務dataまで失われますか。
3. application logだけmaskしても、AI traceやerror reportに元値が残る可能性はありますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security20_pii_masking run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security20_pii_masking run demo
```

出力が`連絡先は [email]、電話は[phone]、顧客IDは[customer-id]です。`となり、dummy元値が出ないことを確認します。demoはPIIを含まない文章が変化しないこともassertします。

## コードを読む順番

1. [`masking_policy.md`](./masking_policy.md): 元値を先にlogへ出さない原則を見る
2. [`masker.js`](../../../src/backend/src/studysecurity/systems/security20_pii_masking/app/masker.js): 3つのruleと適用順を追う
3. [`demo.js`](../../../src/backend/src/studysecurity/systems/security20_pii_masking/app/demo.js): mask対象と非対象の期待値を確認する

## 観察ポイント

- replace後のtextだけを出力し、before値をdebug logへ残さない
- email・電話は国や表記でpatternが変わる
- customer IDはPIIか業務identifierかをdata classificationで定義する
- label置換は元値を復元できないredactionに近い
- model providerへ送る前だけでなく、response・trace・evaluation dataも対象にする

## 安全な改造課題

1. space区切り電話番号や国番号を入れ、期待する範囲を先に決める。
2. false positive・false negativeのcase tableを作る。
3. reversible tokenizationが必要なuse caseとkey管理を設計する。
4. structured JSONのfield単位maskと自由文maskを分ける。

## 自分の言葉で説明する

- maskingとaccess control・encryptionの違い
- raw dataが既にlogへ出た後では遅い理由
- data分類、目的、保持期間に応じて処理を変える必要性

## 学習用実装の制約

- 日本の一部形式とdummy IDだけを正規表現で扱う
- 実PII・実log・外部AI APIを使わない
- 高度な固有表現抽出やDLPを実装しない

## 学習完了の目安

- レベル1（再現）: 3種のdummy PIIが置換されることを確認できる
- レベル2（説明）: 検出漏れ・過剰mask・保存先を説明できる
- レベル3（改造）: structured dataと自由文のprivacy処理を設計できる
