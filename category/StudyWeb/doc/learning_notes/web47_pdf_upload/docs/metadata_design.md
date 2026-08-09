# Metadata Design

| Metadata | 用途 | 現実装 |
|---|---|---|
| originalName | 利用者が選んだ名前 | `name`として表示 |
| size | 上限確認・容量管理 | 表示 |
| contentType | 種類判定の補助 | `type`として表示 |
| sha256 | 整合性・重複確認 | 未実装 |
| storageKey | 本体保存場所 | 未実装 |
| status | uploaded / scanning / ready / failed | 未実装 |
| uploadedAt / userId | 監査・管理 | 未実装 |

ファイル本体はobject storage等、検索・状態管理に使うmetadataはDB等へ分離する構成を検討する。公開用URLと内部storage key、original filenameを混同しない。

AI / RAGへ渡す場合は、scan済み・parse可能・利用権限あり等の状態をmetadataで判断できるようにする。
