# security08 XSS対策

tag形式の入力を`textContent`で文字として表示し、`innerHTML`のような危険なDOM sinkとの差を確認する静的教材です。画面確認は15分、出力contextとCSPの位置付けを説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- ユーザー入力をHTMLではなく文字として表示できる
- `textContent`と`innerHTML`の違いを説明できる
- HTML本文、属性、URL、JavaScript文字列のcontextを区別できる
- CSPをunsafeな表示処理の代替にしない理由を説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [XSS対策 要件定義](../../requirements/security08_xss_requirements.md) |
| 基本設計 | [XSS対策 基本設計](../../basic_design/security08_basic_design.md) |
| 詳細設計 | [XSS対策 詳細設計](../../detailed_design/security08_detailed_design.md) |
| 補足 | [エスケープ規則](./escaping_rules.md) |
| 実装 | [security08 ソース](../../../src/backend/src/studysecurity/systems/security08_xss/) |

## 資料を見る前の確認問題

1. 入力時に`<`を削除すれば、すべての出力先で安全でしょうか。
2. frameworkが既定でescapeする場合でも、危険になり得るAPIは何ですか。
3. CSPを設定すれば`innerHTML`を自由に使ってよいでしょうか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security08_xss run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security08_xss run start
```

browserで`http://localhost:4108`を開き、`<b>sample</b>`をRenderします。Safe欄にはtagが文字として表示され、太字要素にはなりません。Danger noteは危険なsinkを文字で説明するだけで、入力HTMLを実行しません。確認後は`Ctrl+C`で停止します。

## コードを読む順番

1. [`index.html`](../../../src/backend/src/studysecurity/systems/security08_xss/public/index.html): 入力と2つの出力先を確認する
2. [`app.js`](../../../src/backend/src/studysecurity/systems/security08_xss/public/app.js): `textContent`へ値を設定する箇所を追う
3. [`server.js`](../../../src/backend/src/studysecurity/systems/security08_xss/app/server.js): 配信対象を2fileへ固定していることを確認する
4. [`escaping_rules.md`](./escaping_rules.md): contextごとの対策を読む

## 観察ポイント

- `<b>`を含む文字列は入力時には変更せず、HTML本文へ文字として出力する
- `danger`欄も`textContent`なので、説明中の入力値は実行されない
- XSSは反射型、格納型、DOM型で入力経路が異なっても、危険な出力sinkが重要である
- `textContent`が適切なのはHTML本文へ文字を置く場合で、URLや属性には別の検証が必要である
- local serverは教材配信用で、CSP headerやproduction hardeningは実装しない

## 安全な改造課題

1. 入力に引用符、ampersand、改行を加え、文字として表示されることを確認する。
2. URL入力欄を追加する前提で、許可するschemeを設計する。
3. frontend frameworkのescape機能を調べ、escapeを無効化するAPIを一覧にする。
4. CSP headerを追加する場合、主対策と補助対策を分けて説明する。

## 自分の言葉で説明する

- `innerHTML`と`textContent`でbrowserの解釈が異なる理由
- 入力値ではなく出力contextで対策を選ぶ理由
- XSSとCSRFが別の攻撃であり、両方の対策が必要な理由

## 学習用実装の制約

- 危険なHTMLを実行する比較画面は提供しない
- DBを使うstored XSS、server responseを使うreflected XSSは再現しない
- CSP、sanitizer、framework固有APIは説明だけである

## 学習完了の目安

- レベル1（再現）: tag形式の入力が文字として表示されることを確認できる
- レベル2（説明）: DOM sink、出力context、CSPの役割を説明できる
- レベル3（改造）: 新しい出力contextのallowlistまたはencode方針を設計できる

次は[security09 File upload](../security09_file_upload/README.md)へ進み、browserから受け取るmetadataと実file検査の境界を整理します。
