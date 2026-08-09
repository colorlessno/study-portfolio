# web24 Next.js Server Componentのデータ取得

async Server Componentでデータを取得して一覧を生成し、クライアントfetchとの違いを学ぶテーマです。現実装は外部APIではなく、サーバー内の非同期関数が固定データを返します。

## このテーマでできるようになること

- async Server Componentを定義できる
- サーバー側で取得したデータを初期HTMLへ含められる
- Client Componentの`useEffect`が不要なケースを説明できる
- ServerとClientのデータ取得方法を比較できる

## 関連資料

1. [要件定義](../../requirements/web24_next_server_fetch_requirements.md)
2. [基本設計](../../basic_design/web24_basic_design.md)
3. [詳細設計](../../detailed_design/web24_detailed_design.md)
4. [トップページ](../../../src/frontend/src/studyweb/systems/web24_next_server_fetch/app/page.tsx)
5. [Tasksページ](../../../src/frontend/src/studyweb/systems/web24_next_server_fetch/app/tasks/page.tsx)

## 資料を見る前の確認問題

- Server Componentはどこで実行されますか。
- 初期HTMLにデータがあると、ブラウザ側のloading表示は必要でしょうか。
- Server Componentから利用できる秘密情報をClientへ渡す際の注意は何ですか。

## 15分で再開する

1. 開発サーバーを起動する。
2. `/tasks`を開き、初回から3件あることを確認する。
3. Browser Networkに別APIへのfetchがないことを確認する。
4. `TasksPage → fetchTasks`の順にコードを読む。

## 起動方法

実装ディレクトリで`npm install`、`npm run dev`を実行します。`npm run build`でServer Componentを含む本番ビルドを確認できます。

## コードを読む順番

1. `app/page.tsx`で`/tasks`へのLinkを見る。
2. `app/tasks/page.tsx`でTask型を見る。
3. `fetchTasks()`が固定配列をPromiseとして返すことを見る。
4. `TasksPage`がasyncでawaitしてからJSXを返すことを見る。
5. `"use client"`、useEffect、useStateがないことを確認する。

## 処理の流れ

```text
Browserが/tasksを要求
  ↓
Next.jsサーバーでTasksPage実行
  ↓
fetchTasksをawait
  ↓
一覧を含むHTMLを生成
  ↓
Browserへ応答
```

## 観察ポイント

- 初期表示から一覧が含まれるか
- Browserから別APIへの通信が発生しないか
- statusのunion型が3値に制限されるか
- listのkeyへ安定したidを使っているか
- 現在のfetchTasksが実通信ではないことを説明できるか

## 壊して直す演習

1. `TasksPage`からasyncを外した場合にawaitとの関係がどうなるか確認する。
2. Taskのstatusへ未定義値を入れ、TypeScriptエラーを見る。
3. `await fetchTasks()`を固定配列へ置き換え、非同期境界の意味を比較する。
4. 一時的に例外を投げ、Next.jsのサーバー側エラー表示とログを見る。

## 自分の言葉で説明する

- Server Componentでデータ取得する利点を説明してください。
- web19のBrowser fetchとweb24の取得は何が違いますか。
- 本物のAPIやDB取得へ置き換える場合、どの関数を変更しますか。

## うまく動かないとき

- 画面エラーでは、ブラウザだけでなく開発サーバーのログを確認します。
- `/tasks`が404なら、`app/tasks/page.tsx`の位置を確認します。
- Client Hook関連のエラーが出る場合は、Server ComponentへHookを追加していないか確認します。

## 学習完了の目安

- [ ] 初期HTMLに3件表示された
- [ ] Browser側に別API通信がないことを確認した
- [ ] ServerとClientの取得方法を比較した
- [ ] `npm run build`が成功した
