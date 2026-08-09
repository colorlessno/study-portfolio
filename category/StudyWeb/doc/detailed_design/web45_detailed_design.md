# web45 楽観ロック 詳細設計

## 0. 関連文書

- `../requirements/web45_optimistic_lock_requirements.md`
- `../basic_design/web45_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web45_optimistic_lock/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web45_optimistic_lock/
  README.md
  docs/conflict_flow.md
  docs/optimistic_lock_check.md
```

## 2. データ

```text
Record
  id: number
  name: string
  version: number
```

`record`が現在値、`a`と`b`が利用者A・Bの読込snapshot。初期recordは`Original`, version 1。

## 3. 画面操作

| 操作 | 処理 |
|---|---|
| load A | 現在recordをAへclone |
| load B | 現在recordをBへclone |
| save A | Aのversionで更新を試す |
| save B | Bのversionで更新を試す |

## 4. 保存判定

1. snapshotがなければ未読込を返す。
2. snapshot.versionとrecord.versionを比較する。
3. 不一致なら競合messageを返し、recordを変更しない。
4. 一致ならnameを更新する。
5. record.versionを1増やす。
6. 保存成功messageを返す。

## 5. 競合再現

```text
A load v1
B load v1
A save v1 -> success, record v2
B save v1 -> conflict, record remains v2
B reload v2
B save v2 -> success, record v3
```

## 6. 要件との差分・既知の課題

- 静的JavaScript内で再現し、API・DB・同時通信はない。
- 409は画面文字列であり、HTTP 409 responseではない。
- version条件付きUPDATEの原子性をDBで保証していない。
- 利用者が入力する更新内容、差分比較、再編集導線はない。
- 悲観ロックやtransactionの実装比較は対象外。

API・DB版では、概念上 `UPDATE ... WHERE id = ? AND version = ?` の更新件数が0なら競合として扱い、現在値と再読込導線をHTTP 409で返す。

## 7. 確認手順

1. 未読込のsaveを確認する。
2. A・Bで同じversionを読む。
3. Aを保存してversionが進むことを確認する。
4. Bの古いversionが競合し、recordを変えないことを確認する。
5. Bを再読込後に保存できることを確認する。
6. 保存済みAを再度保存し、古いsnapshotになることを確認する。

## 8. 完了条件

- version一致時だけ更新できる。
- 競合時にrecordを上書きしない。
- 再読込後に保存できる理由を説明できる。
- HTTP 409と再編集導線を設計できる。
