# security17 Prompt Injection対策

入力を通常、命令上書き疑い、secret要求へ分類する静的ruleで、AI入力の信頼境界を学ぶlocal教材です。外部AI APIには送信しません。CLI再現は15分、防御層を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- system instruction、user input、retrieved dataを別の信頼domainとして扱える
- Prompt Injection分類を完全防御と誤解しない
- tool権限、output schema、承認を後段の防御として設計できる
- 判定理由を安定したreason codeで記録できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [Prompt Injection 要件定義](../../requirements/security17_prompt_injection_requirements.md) |
| 基本設計 | [Prompt Injection 基本設計](../../basic_design/security17_basic_design.md) |
| 詳細設計 | [Prompt Injection 詳細設計](../../detailed_design/security17_detailed_design.md) |
| 補足 | [Guardrail policy](./guardrail_policy.md) |
| 実装 | [security17 ソース](../../../src/backend/src/studysecurity/systems/security17_prompt_injection/) |

## 資料を見る前の確認問題

1. 「前の指示を無視して」という文字だけを拒否すれば十分ですか。
2. modelが拒否すると答えても、強いtool権限を持つ場合に何が残りますか。
3. LLM出力をJSONとしてparseできたことは、操作して安全という意味ですか。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security17_prompt_injection run check
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security17_prompt_injection run demo
npm.cmd --prefix category/StudySecurity/src/backend/src/studysecurity/systems/security17_prompt_injection run start
```

CLIでは`answer`、`review`、`reject`を確認します。画面は`http://localhost:4117`で同じ判定関数を使います。確認後は`Ctrl+C`でserverを停止します。

## コードを読む順番

1. [`guardrail_policy.md`](./guardrail_policy.md): 防御対象と限界を確認する
2. [`app.js`](../../../src/backend/src/studysecurity/systems/security17_prompt_injection/public/app.js): 3つのdecisionとreasonを見る
3. [`demo.js`](../../../src/backend/src/studysecurity/systems/security17_prompt_injection/app/demo.js): 期待値を固定したcaseを追う
4. [`server.js`](../../../src/backend/src/studysecurity/systems/security17_prompt_injection/app/server.js): local教材だけを配信することを確認する

## 観察ポイント

- pattern ruleは既知表現の教材で、言い換え・別言語・encodingを網羅しない
- secret要求を拒否しても、model contextへ実secretを入れない設計が先に必要
- `review`は安全判定ではなく、人・別policyによる次の判断を求める状態
- promptを強くするだけでなく、最小権限と操作前validationを組み合わせる
- inputとoutputのlogにsecret・PIIを残さない

## 安全な改造課題

1. reason codeごとの期待decisionをtable-driven testへ追加する。
2. outputをallowlist schemaへ制限し、不明fieldを拒否する。
3. read-only toolと変更toolで権限・承認を分ける。
4. false positive、false negative、未判定の記録方法を決める。

## 自分の言葉で説明する

- direct Prompt Injectionとindirect Prompt Injectionの入口
- input filterだけで完全防御できない理由
- model、application、tool、human reviewの各責務

## 学習用実装の制約

- keywordを使う決定的な分類だけで、LLMを実行しない
- 攻撃手順や実secretを扱わない
- 判定結果から外部操作を実行しない

## 学習完了の目安

- レベル1（再現）: 3つのdecisionをCLIと画面で確認できる
- レベル2（説明）: instruction hierarchyと後段防御を説明できる
- レベル3（改造）: 最小権限・schema・承認を含む防御を設計できる
