# security18 RAG Injection体験 要件定義

## 1. 目的

検索文書に埋め込まれた悪意ある指示をAIが拾うRAG Injectionを学ぶ。

## 2. 学習対象

- RAG Injection
- untrusted document
- source metadata
- instruction hierarchy
- citation / grounding

## 3. 作成する成果物

- 悪意ある文書サンプル
- RAG風検索サンプル
- 危険な回答例
- 防御メモ

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 文書内の悪意ある指示例を確認できる |
| FR-02 | 文書内容とシステム指示を分けて扱える |
| FR-03 | source metadataを記録できる |
| FR-04 | 文書由来の指示を実行しない方針を説明できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | 実LLMなしでも疑似的に学べる |
| NFR-02 | 危険文書は学習用に閉じる |
| NFR-03 | RAG評価や根拠管理へ接続できる |

## 6. 対象外

- ベクトルDB実装
- 本格RAG評価
- LLM gateway

## 7. 受入条件

- RAG Injectionの成立理由を説明できる
- 検索文書を信頼済み指示として扱わない理由を説明できる
- source metadataの重要性を説明できる

## 8. 学習観点

- 文書は信頼できるとは限らない
- RAGの根拠と指示を混同しない
- 検索結果の由来を追跡する
