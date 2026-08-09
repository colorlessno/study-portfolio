# system36 Trace storage 学習ノート

## このテーマで学ぶこと

- AI処理の入力、検索結果、設定、出力、評価をtraceとして残す理由
- 障害調査、比較、再実行に必要なfield
- 再現性と個人情報・secret保護のtrade-off

## 15分で再開する

```powershell
python category/StudyAI\scripts\validate-ai-learning.py system36 --show-output
```

実行前に再実行へ必要な情報を列挙し、`trace_record`と`replay_note`に足りないものを確認してください。

## 観察ポイント

1. 入力dataがtrace recordへ保持されることを確認する。
2. 同じ入力から同じtrace IDが作られることを確認する。
3. model設定、prompt version、timestamp、評価が既定入力にないことを確認する。

## この実装の境界

trace形状のdictを返すだけで、永続化、一覧、検索、再実行、mask、access制御、保持期限は未実装です。入力hash由来のIDも実行ごとの一意IDではありません。出力されたことと保存されたことを混同しません。

## 演習

- 再現に必要なmodel、prompt、retrieval、設定、version fieldを追加設計する。
- PII、secret、長文contextの保存・mask・保持期限を決める。
- 同じ入力を別modelで実行する場合のtrace ID設計を考える。

説明できるようにする問い:

- 回答本文だけを保存しても原因調査できないのはなぜか。
- 詳細traceを無制限に保存すると何が危険か。

## 完了条件

- validatorが`PASS system36`を表示する。
- 再現、監査、securityに必要なfieldを説明できる。
- trace object生成と永続保存を区別できる。

## 関連資料

- [要件定義](../../requirements/system36_requirements.md)
- [基本設計](../../basic_design/system36_basic_design.md)
- [詳細設計](../../detailed_design/system36_detailed_design.md)
- [テーマ定義](../../../src/backend/src/studyai/systems/ai_learning/catalog.py)
- [共通サービス実装](../../../src/backend/src/studyai/systems/ai_learning/service.py)
- [既存テスト](../../../src/backend/tests/systems/test_ai_learning_systems.py)
