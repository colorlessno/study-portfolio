# 残リスク

## risk表

| risk | 残る理由 | 後で下げる方法 |
| --- | --- | --- |
| runtime未実行 | Dockerまたはdependencyが使えない | smoke testを実行する |
| failure case未再現 | 2 session または timing が必要 | 手動手順を追加する |
| performance未測定 | datasetが小さい | 大きなseedを追加する |
| security境界が推測 | abuse-case testがない | negative testを追加する |

## review終了ルール

残リスクがあってもreviewは有用。ただし、そのriskを明示する。未検証の動作を黙ってpass扱いにしない。
