# security05 入力検証

商品入力とCSV行を対象に、必須、型、長さ、数値範囲、列数を分けて検証する依存パッケージなしのCLI教材です。実行は15分、検証境界とエラー設計を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- 型、形式、業務制約を別の観点として説明できる
- 複数fieldの検証結果をエラー配列として扱える
- CSVエラーへ行番号を加える理由を説明できる
- frontendとserver-sideの検証の役割を区別できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [入力検証 要件定義](../../requirements/security05_input_validation_requirements.md) |
| 基本設計 | [入力検証 基本設計](../../basic_design/security05_basic_design.md) |
| 詳細設計 | [入力検証 詳細設計](../../detailed_design/security05_detailed_design.md) |
| 補足 | [検証ケース](./validation_cases.md) |
| 実装 | [security05 ソース](../../../src/backend/src/studysecurity/systems/security05_input_validation/) |

## 資料を見る前の確認問題

1. frontendで入力を検証済みなら、API側の検証を省略できるでしょうか。
2. 空文字、文字列の数字、負数はそれぞれ何の違反でしょうか。
3. CSVエラーに行番号がない場合、利用者の修正作業へどのような影響がありますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security05_input_validation run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security05_input_validation test
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security05_input_validation run demo
```

自動テストで価格0・1,000,000、商品名40文字、文字列価格、CSV列数、row numberを確認します。demoの固定サンプルでは、正常商品は空のエラー配列、空の商品名と負数価格は2件のエラー、正常なCSV行は空配列、1列だけのCSV行は`column_count`になります。

## コードを読む順番

1. [`validation_cases.md`](./validation_cases.md): 期待する境界値を予想する
2. [`validators.js`](../../../src/backend/src/studysecurity/systems/security05_input_validation/app/validators.js)の`validateProduct`: fieldごとの条件を追う
3. `validateCsvRow`: 列数を先に検証し、商品validatorを再利用する流れを追う
4. [`server.js`](../../../src/backend/src/studysecurity/systems/security05_input_validation/app/server.js): 固定サンプルと出力を対応付ける

## 観察ポイント

- `Number.isInteger`は文字列の`"1200"`を整数として扱わない
- 価格0は許可し、負数と1,000,000超過は拒否する
- CSVは3列を要求し、2列目をname、3列目をpriceとして検証する
- validatorは最初のエラーで終了せず、修正可能なfieldエラーをまとめる
- ファイル名が`server.js`でもHTTP serverではなくCLI demoである

## 安全な改造課題

1. 商品名41文字、価格0、価格1,000,000、価格1,000,001の境界値を追加する。
2. 商品IDの形式検証を追加し、CSVの1列目を検証対象にする。
3. エラーmessageへ利用者向け文言を直接入れず、codeから表示文言へ変換する設計を考える。
4. HTTP APIへ組み込む場合、400 responseと内部ログをどう分けるか設計する。

## 自分の言葉で説明する

- client-side検証とserver-side検証の違い
- 型、形式、範囲、業務制約の検証順序
- CSVエラーへrowNumberとfieldを付ける理由

## 学習用実装の制約

- HTTP request、実CSV file、DB保存は扱わない
- 文字の正規化、使用可能文字、localeは扱わない
- 自動テストは関数へ直接入力し、HTTP requestや実CSV fileの読み込みは検証しない

## 学習完了の目安

- レベル1（再現）: 正常・異常商品のエラー配列を確認できる
- レベル2（説明）: 検証の種類、境界、エラー粒度を説明できる
- レベル3（改造）: 新しい制約と境界ケースを追加し、結果を予測できる

次は[security06 SQL Injection](../security06_sql_injection/README.md)へ進み、入力検証とは別にSQL構文と値を分離する理由を確認します。
