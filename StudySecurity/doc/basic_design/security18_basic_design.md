# security18 RAG Injection体験 基本設計
## 0. 関連要件

- `../requirements/security18_rag_injection_requirements.md`

## 1. 設計目的
検索文書内の悪意ある指示をAIが拾う危険性を疑似的に確認する。
## 2. 対象範囲

- untrusted document
- malicious document instruction
- source metadata
- grounding
- instruction hierarchy

## 3. 成果物構成

```text
src/backend/src/studysecurity/systems/security18_rag_safety/
  README.md
  app/
  docs/rag_injection_cases.md
  docs/defense_notes.md
```

## 4. 入力
| 入力 | 内容 |
|---|---|
| document | 通常文書・悪意ある文書 |
| question | 検索質問 |
| metadata | source id |

## 5. 出力
| 出力 | 内容 |
|---|---|
| retrieved context | 検索文書 |
| unsafe answer | 危険例 |
| guarded answer | 防御例 |

## 6. 処理方針
1. 悪意ある文書をローカルサンプルとして用意する
2. 文書内容とシステム指示を分ける
3. 文書由来の指示を実行しない
4. source metadataを残す

## 7. 確認観点

- 文書を信頼済み指示として扱っていないか
- source metadataが残るか
- RAG評価や根拠確認へ接続できるか
## 8. 後続工程への引き継ぎ

詳細設計では、文書サンプル、疑似検索、危険例、防御例を定義する。
