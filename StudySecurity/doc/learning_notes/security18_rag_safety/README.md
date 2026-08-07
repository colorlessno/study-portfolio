# security18 RAG安全対策

trusted、untrusted、restrictedの架空文書を検索し、source・trust・access decisionを分けて学ぶlocal教材です。外部LLMやvector DBは使いません。3区分の比較は15分、production境界を説明するまでは45〜90分が目安です。

## このテーマでできるようになること

- retrieved documentを命令ではなくdataとして扱える
- source provenance、content trust、authorizationを区別できる
- untrusted文書内の命令を無視し、restricted文書を承認待ちにできる
- citationが正しさや閲覧権限を保証しないと説明できる

## 工程を横断する

| 工程 | 成果物 |
|---|---|
| 要件 | [RAG安全対策 要件定義](../../requirements/security18_rag_safety_requirements.md) |
| 基本設計 | [RAG安全対策 基本設計](../../basic_design/security18_basic_design.md) |
| 詳細設計 | [RAG安全対策 詳細設計](../../detailed_design/security18_detailed_design.md) |
| 補足 | [RAG trust boundary](./rag_trust_boundary.md) |
| 実装 | [security18 ソース](../../../src/backend/src/studysecurity/systems/security18_rag_safety/) |

## 資料を見る前の確認問題

1. 検索結果へ出た文書は、質問者が閲覧を許可された文書ですか。
2. source IDを表示すれば、その文書内容が正しいと保証できますか。
3. 文書内に「前の指示を無視」とあった場合、回答材料と命令をどう分けますか。

## 15分で再開する

```powershell
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security18_rag_safety run check
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security18_rag_safety run demo
npm.cmd --prefix StudySecurity/src/backend/src/studysecurity/systems/security18_rag_safety run start
```

CLIでは空queryによる3文書のactionを確認します。画面は`http://localhost:4118`で、空欄・`返品`・`社内`を比較します。確認後は`Ctrl+C`で停止します。

| trust | 期待action |
|---|---|
| trusted | `cite_with_label` |
| untrusted | `ignore_instructions_and_review_content` |
| restricted | `needs_approval` |

## コードを読む順番

1. [`rag_trust_boundary.md`](./rag_trust_boundary.md): 3つの境界を確認する
2. [`documents.json`](../../../src/backend/src/studysecurity/systems/security18_rag_safety/samples/documents.json): 架空documentを見る
3. [`app.js`](../../../src/backend/src/studysecurity/systems/security18_rag_safety/public/app.js): 検索とtrust別actionを追う
4. [`demo.js`](../../../src/backend/src/studysecurity/systems/security18_rag_safety/app/demo.js): 3区分の期待値を確認する

## 観察ポイント

- sample配列と画面用配列は教材では同じだが、productionではsource of truthを一元化する
- untrustedは即拒否ではなく、文書内命令を無視して内容を別途評価する
- restrictedは生成後に伏せるよりretrieval前にauthorizationで除外する
- ranking上位であることはtrustが高いことを意味しない
- document versionとaccess decisionもcitationと一緒に追跡する

## 安全な改造課題

1. user roleを入力し、retrieval前にrestricted文書をfilterする。
2. source、version、owner、updatedAtをmetadataへ追加する。
3. 文書本文とsystem instructionを別fieldでmodelへ渡すschemaを設計する。
4. groundedness、relevance、safetyを別の評価軸にする。

## 自分の言葉で説明する

- retrieval、authorization、generationの境界
- indirect Prompt Injectionが文書経由で入る仕組み
- citation、grounding、truthfulnessの違い

## 学習用実装の制約

- 単純な部分一致だけでvector検索・rankingを行わない
- 外部文書、実PII、実secretを扱わない
- 回答生成やdocument-level access基盤を実装しない

## 学習完了の目安

- レベル1（再現）: 3つのtrust区分とactionを確認できる
- レベル2（説明）: source・trust・accessの違いを説明できる
- レベル3（改造）: retrieval前後のfilterと評価を設計できる
