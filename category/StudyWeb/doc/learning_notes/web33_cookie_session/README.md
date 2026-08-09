# web33 Cookie / Session 最小サンプル

ブラウザの Cookie には session ID だけを保存し、ログイン中のユーザー情報はサーバー側メモリで管理する最小サンプル。画面だけでなく、通信と保存領域からログイン状態を追跡する。

## このテーマで身につけること

- Cookie と Session の保存場所と役割を区別する
- login、認証が必要な API、logout の一連の流れを説明する
- `HttpOnly`、`SameSite`、`Path` の属性を DevTools で確認する
- Cookie があっても Session が存在しなければログイン状態にならないことを理解する

## 10分で再開する

前提は Node.js 20 以上。リポジトリルートから実行する。

```powershell
cd category/StudyWeb\src\backend\src\studyweb\systems\web33_cookie_session
npm.cmd test
npm.cmd start
```

`http://localhost:3033/` を開き、DevTools の Network タブと Application タブを表示する。終了は `Ctrl+C`。

依存パッケージはなく、`npm install` は不要。自動テストはephemeral portでlogin → me → logout → meとCookie属性を確認する。構文確認は `npm.cmd run build` で行える。

## 最初に試す順番

1. Cookie がない状態で `me` を押し、401 を確認する
2. `login` を押し、200 と response header の `Set-Cookie` を確認する
3. Application タブの Cookies で `sid` と各属性を確認する
4. `me` を押し、200 とユーザー情報を確認する
5. `logout` を押し、Cookie が削除されることを確認する
6. もう一度 `me` を押し、401 に戻ることを確認する

確認項目は [Cookie確認](docs/cookie_check.md)、全体の流れは [Session Flow](docs/session_flow.md) に短くまとめている。

## コードを読む順番

1. `sessions = new Map()` で Session 本体の保存場所を見る
2. `POST /login` で `randomUUID()`を使うsession IDの生成、Mapへの保存、`Set-Cookie`を追う
3. `parseCookie` と `GET /me` で、Cookie から Session を検索する流れを追う
4. `POST /logout` で、Session の削除と Cookie の期限切れを確認する
5. HTML 内の `fetch` で、ブラウザが Cookie を送る設定を見る

## 観察ポイント

- Cookie の値は `sid_...` だけで、ユーザー名は Cookie に保存されない
- `HttpOnly` の Cookie は JavaScript から読み取れないが、ブラウザは通信時に送信できる
- `SameSite=Lax` は cross-site 通信で Cookie を送る条件に関係する
- Session はプロセス内の Map にしかないため、サーバーを停止すると消える
- HTTPS を使わないローカル学習用なので `Secure` 属性は付けていない。本番設計を示す実装ではない

## 壊して確かめる

- login 後、Cookie を残したままサーバーを再起動し、`me` が 401 になることを確認する
- Application タブで `sid` を削除し、サーバー側に Session が残っていても `me` が 401 になる理由を説明する
- `Set-Cookie` の `Path=/` を一時的に外し、Cookie の適用範囲を比較する
- login を2回行い、Cookie が新しい `sid` に置き換わることと、古い Session が Map に残ることを確認する

最後の項目は、この最小実装に Session の期限・掃除処理がないという改善点の発見にもなる。

## 自分の言葉で説明する

- Cookie と Session はそれぞれどこに保存されるか
- `sid` だけではユーザー情報が分からないのに、なぜログイン状態を復元できるか
- 401 になるケースを少なくとも3つ挙げられるか
- logout でサーバー側とブラウザ側の両方を処理する理由は何か

## 完了条件

- 自動テストでlogin → me → logout → meを再現した
- login → me → logout → me の status と Cookie の変化を説明できる
- `HttpOnly`、`SameSite=Lax`、`Path=/` を DevTools で確認した
- サーバー再起動後に Cookie だけ残るケースを再現し、401 の理由を説明できる
- この実装が本番認証には不足する点を2つ以上挙げられる
