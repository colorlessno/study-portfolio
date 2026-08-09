# system29 Chunk metadata design 学習ノート

## このテーマで学ぶこと

- RAGのchunkへsource、page、permissionなどを付ける目的
- 根拠表示、更新追跡、権限制御で必要なmetadataの違い
- textとmetadataを一緒に検証・version管理する考え方

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system29 --show-output
```

実行前にcitation表示を予想し、`chunks[0].metadata`と`citation_preview`を確認してください。

## 観察ポイント

1. 入力metadataがchunkへ保持されることを確認する。
2. sourceとpageからcitation文字列が作られることを確認する。
3. permissionが保存されてもaccess制御には使われていないことを確認する。

## この実装の境界

文書全体を1つのchunkへ包み、metadataをcopyするだけのmockです。schema validation、複数chunk分割、filter検索、permission enforcement、更新時の再indexは行いません。metadataが存在することと、権限が守られることは別です。

## 演習

- source、page、section、permission、updated_at、versionの必須・任意を決める。
- sourceやpageが欠けた入力でcitationがどうなるか確認する。
- 検索前filter、検索後filterのsecurity上の違いを説明する。

説明できるようにする問い:

- metadataなしのRAGで障害調査や根拠確認が難しいのはなぜか。
- permission fieldを保存しただけでは認可にならないのはなぜか。

## 完了条件

- validatorが`PASS system29`を表示する。
- 根拠、鮮度、権限に必要なmetadataを分類できる。
- metadata保持と実際のfilter・認可を区別できる。

## 関連資料

- [要件定義](../../requirements/system29_requirements.md)
- [基本設計](../../basic_design/system29_basic_design.md)
- [詳細設計](../../detailed_design/system29_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
