# Optimistic Lock Check

| 操作 | 期待する結果 |
|---|---|
| loadせずsave | `未読込` |
| A / Bを同じversionでload | 両方が同じsnapshotを保持 |
| Aを先にsave | 成功し、record.versionが1増える |
| 古いBをsave | 競合し、recordを変更しない |
| Bを再loadしてsave | 最新versionなので成功 |
| 保存済みの古いAを再save | 競合 |

## 確認する不変条件

- version一致時だけ更新できる
- 成功するたびにversionが1増える
- 競合時はnameもversionも変更しない
- 競合した利用者へcurrent / yoursを示す

現在の`409 conflict`は画面文字列でありHTTP responseではない。API版ではversion条件付き更新が0件だった場合にHTTP 409と安定したerror bodyを返す。
