# devops02 lint / unit test

目安: 20〜35分。静的な規約違反を探すlintと、振る舞いを確認するunit testを分け、CI失敗の意味を説明できるようにします。

## このテーマでできるようになること

- lintとunit testが検出する問題の違いを説明する。
- 正常系だけでなく、ゼロ除算のような異常系をtest caseにする。
- 個別scriptと一括`check`を目的に応じて使い分ける。

## 成果物

- [要件定義](../../requirements/devops02_lint_unit_test_requirements.md)
- [基本設計](../../basic_design/devops02_basic_design.md)
- [詳細設計](../../detailed_design/devops02_detailed_design.md)
- [計算処理](../../../src/apps/devops02_lint_unit_test/src/calculator.js)
- [unit test](../../../src/apps/devops02_lint_unit_test/test/calculator.test.js)
- [lint script](../../../src/apps/devops02_lint_unit_test/scripts/lint.js)

## 始める前に予想する

1. `divide(1, 0)`は戻り値と例外のどちらにすると呼び出し側が誤用しにくいか。
2. lintが成功してunit testが失敗する例、逆の例を1つずつ挙げられるか。

## 15分で再開する

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops02_lint_unit_test ci
npm.cmd --prefix StudyDevOps/src/apps/devops02_lint_unit_test run lint
npm.cmd --prefix StudyDevOps/src/apps/devops02_lint_unit_test test
```

期待結果は`lint ok`に続き、3件のテストが成功することです。まとめて確認するときは次を使います。

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops02_lint_unit_test run check
```

## 読む順番と観察点

1. `calculator.js`の公開関数と入力境界を読む。
2. test名だけを読み、未確認の振る舞いを予想する。
3. test本体と実行結果を対応付ける。
4. `lint.js`を読み、一般的なlinterではなく教材用の最小検査だと確認する。

`check`の途中でlintが失敗するとunit testへ進まない点も観察します。

## 安全に壊して直す

作業ブランチで`add`を一時的に減算へ変え、lintは通るがunit testは失敗することを確認します。その後、実装を元に戻して`check`を成功させます。

## 説明してみる

- lintだけでは`add`の計算間違いを検出できないのはなぜか。
- testをCIの別stepに分けると、レビュー時の判断がどう速くなるか。

## 制約と完了条件

このlintはESLint等の代替ではなく、役割分担を学ぶ最小実装です。secret、token、password、個人情報はtest dataに使いません。

- [ ] lintと3件のunit testが成功した。
- [ ] lintとtestの守備範囲を説明した。
- [ ] 意図した失敗を作り、原因を特定して復旧した。
