# security06 SQL Injection対策

同じ入力を文字列連結SQLとparameterized queryへ渡し、SQL本文が変化する危険性と、placeholderへ値を分離する対策を比較するCLI教材です。実行は15分、入力検証との役割分担まで説明するには45〜90分が目安です。

## このテーマでできるようになること

- 文字列連結で入力がSQL構文へ混入する理由を説明できる
- SQL本文とparameter配列を分離できる
- placeholder番号とparameter順序を対応付けられる
- 入力検証だけではparameterized queryを代替できないと説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [SQL Injection対策 要件定義](../../requirements/security06_sql_injection_requirements.md) |
| 基本設計 | [SQL Injection対策 基本設計](../../basic_design/security06_basic_design.md) |
| 詳細設計 | [SQL Injection対策 詳細設計](../../detailed_design/security06_detailed_design.md) |
| 補足 | [パラメータ化](./parameterized_query.md) |
| 実装 | [security06 ソース](../../../src/backend/src/studysecurity/systems/security06_sql_injection/) |

## 資料を見る前の確認問題

1. 入力から単一引用符を除去すればSQL Injectionを完全に防げるでしょうか。
2. placeholderはDB driverへ何を伝えますか。
3. ORMを使っていてもraw queryで文字列連結をすれば何が起きますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security06_sql_injection run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security06_sql_injection run demo
```

危険例では入力がSQL本文へ連結されます。対策例ではSQL本文に`$1`、`$2`だけが入り、入力は`params`へ分離されます。本教材は構造比較だけを行い、SQLを実行しません。

## コードを読む順番

1. [`demo.js`](../../../src/backend/src/studysecurity/systems/security06_sql_injection/app/demo.js): 同じ入力を2方式へ渡すことを確認する
2. [`query_builder.js`](../../../src/backend/src/studysecurity/systems/security06_sql_injection/app/query_builder.js)の`unsafeSearch`: template literalへ入力が混入する箇所を見る
3. `safeSearch`: parameterを追加してからplaceholder番号を作る順序を追う
4. [`parameterized_query.md`](./parameterized_query.md): DB driverが値として扱う境界を確認する

## 観察ポイント

- 危険なのは特定の文字列ではなく、入力とSQL構文の境界がない設計である
- `safeSearch`のSQL本文には入力値が含まれない
- `%`を含む検索値もparameter側へ入れる
- nameがない場合はstatusが`$1`になり、parameter順序と一致する必要がある
- 実DBへ接続しないため、DB driverによるbind処理そのものは未検証である

## 安全な改造課題

1. nameなし・statusあり、両方なしのSQLとparamsを予想して確認する。
2. minPrice条件を追加し、placeholder番号が連続することを確認する。
3. column名やsort方向のようにparameter化できない要素をallowlistで選ぶ設計を追加する。
4. 利用者向けエラーへSQL本文を含めないresponse設計を考える。

## 自分の言葉で説明する

- 文字列連結とparameterized queryの信頼境界
- 入力検証とparameterized queryを両方行う理由
- ORMやquery builderでもraw文字列を慎重に扱う理由

## 学習用実装の制約

- 実DB、driver、ORMを使用せず、SQLを実行しない
- transaction、DB権限、監査logは扱わない
- 危険入力はローカルの固定文字列だけを使う

## 学習完了の目安

- レベル1（再現）: unsafe SQLとsafe SQL / paramsを比較できる
- レベル2（説明）: 構文と値の分離、placeholder、入力検証との違いを説明できる
- レベル3（改造）: 検索条件を追加し、SQLとparameter順序を保てる

次は[security07 CSRF](../security07_csrf/README.md)へ進み、Cookieが自動送信される境界を確認します。
