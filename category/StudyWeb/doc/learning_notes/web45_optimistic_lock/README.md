# web45 楽観ロック

同じrecordを利用者A・Bが同じversionで読み、Aの保存後にBの古いversionを拒否する静的サンプル。後から保存した人が、先に保存された変更を無条件に上書きする事故を防ぐ考え方を学ぶ。

## このテーマで身につけること

- 読込時versionを更新requestへ含める理由を説明する
- 現在versionと読込時versionを比較して競合を検出する
- 競合後に再読込・差分確認・再編集が必要な理由を理解する
- 楽観ロックと悲観ロックの考え方を区別する

## 10分で再開する

Dockerで静的画面を配信する。

```powershell
cd category/StudyWeb\src\frontend\static\studyweb\systems\web45_optimistic_lock
docker build -t studyweb-web45 .
docker run --rm -p 3045:80 studyweb-web45
```

`http://localhost:3045/app/` を開く。終了は `Ctrl+C`。

簡単な確認なら `app/index.html` を直接開ける。構文確認は次を使う。

```powershell
node --check app/src/main.js
```

## 競合を再現する

1. `load A`を押し、Aがversion 1を読む
2. `load B`を押し、Bもversion 1を読む
3. `save A`を押し、recordがversion 2になることを確認する
4. `save B`を押し、`409 conflict current=2 yours=1`を確認する
5. Bの保存失敗後もrecordがAの内容・version 2のままであることを見る
6. `load B`で最新versionを読み直してから`save B`を押し、version 3へ進むことを確認する

流れは [Conflict Flow](docs/conflict_flow.md)、確認項目は [Optimistic Lock Check](docs/optimistic_lock_check.md) を参照する。

## コードを読む順番

1. `record`のid、name、versionを見る
2. A・Bが別々の読込結果を持つ変数であることを確認する
3. `clone`でrecordのsnapshotを作る理由を見る
4. `save`の未読込判定を読む
5. copy.versionとrecord.versionの比較を追う
6. 一致時だけnameを更新し、versionを1進める処理を見る
7. 各buttonがload・saveのどちらを呼ぶか確認する

## 状態の変化

| 操作 | record | A | B | 結果 |
|---|---|---|---|---|
| 初期 | v1 | 未読込 | 未読込 | - |
| load A / B | v1 | v1 | v1 | 同じsnapshot |
| save A | v2 | v1 | v1 | A成功 |
| save B | v2 | v1 | v1 | B競合 |
| load B → save B | v3 | v1 | v2 | B再読込後に成功 |

## 現実装の範囲

- 1画面内のJavaScript変数でA・Bを再現し、API・DB・実際の同時通信は使わない
- `409 conflict`は画面に表示する文字列であり、HTTP 409 responseではない
- 保存値はA / Bの固定文字列で、利用者入力や差分統合はない
- 競合後の自動再読込や、利用者が変更内容を比較する画面はない
- DBの原子的な`WHERE id = ? AND version = ?`更新は実装していない

## 壊して確かめる

- 読込前にsaveを押し、`未読込`の結果を確認する
- Aだけload・saveした後、もう一度save Aを押して古いcopyが競合することを確認する
- A・Bそれぞれにname入力欄を追加し、競合時に両方の値を表示する
- 競合resultを文字列ではなく`{ ok, status, current, yours }`へ変更する
- 再読込buttonと、再編集を促すmessageを追加する
- API・DB版としてversion条件付きUPDATEとHTTP 409を設計する

## 自分の言葉で説明する

- versionを読込時と保存時の両方で扱う理由は何か
- 「最後に保存した人が勝つ」方式にはどんな上書き事故があるか
- 競合時に自動で再送すると危険な場合があるのはなぜか
- 楽観ロックと悲観ロックは、競合への備え方がどう違うか

## 完了条件

- A / Bの同一version読込から競合までを再現した
- 競合後にrecordが上書きされていないことを確認した
- 再読込後なら保存できる理由を説明できる
- 競合時の再読込・比較・再編集導線を1つ以上追加した
