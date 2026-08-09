# web25 Next.jsフォーム送信

Next.js App Router、Reactの`useActionState`、Server Actionを使い、フォーム入力をサーバー側で検証して同じ画面へ結果を返すテーマです。

## このテーマでできるようになること

- Server ComponentとClient Componentの境界を説明できる
- formとServer Actionを接続できる
- `useActionState`で結果とpendingを表示できる
- サーバー側で必須入力を検証できる

## 関連資料

1. [要件定義](../../requirements/web25_next_form_action_requirements.md)
2. [基本設計](../../basic_design/web25_basic_design.md)
3. [詳細設計](../../detailed_design/web25_detailed_design.md)
4. [Client Component](../../../src/frontend/src/studyweb/systems/web25_next_form_action/app/FormClient.tsx)
5. [Server Action](../../../src/frontend/src/studyweb/systems/web25_next_form_action/app/actions.ts)

## 資料を見る前の確認問題

- `"use client"`と`"use server"`は、何の境界を示しますか。
- クライアント側だけでなくサーバー側でも入力検証する理由は何ですか。
- REST APIを別途作る構成とServer Actionは何が違いますか。

## 15分で再開する

1. 開発サーバーを起動する。
2. titleを空で送信し、エラーを見る。
3. titleだけ、次にtitleとdescriptionを送信する。
4. `FormClient.tsx`から`actions.ts`への流れを辿る。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run dev
```

表示されたURLをブラウザで開きます。3000番をweb13・14等が使っている場合は、先に停止するかNext.jsが案内する別ポートを使用します。`npm run build`で本番ビルドも確認します。

## コードを読む順番

1. `app/page.tsx`でServer ComponentからFormClientを配置する流れを見る。
2. `app/FormClient.tsx`で`"use client"`と`useActionState`を見る。
3. formの`action={formAction}`とpending表示を見る。
4. `app/actions.ts`で`"use server"`、FormData、trim、戻り値を見る。
5. `app/globals.css`でsuccess/errorの表示を見る。

## データの流れ

```text
Browserのform
  ↓ FormData
createTask Server Action
  ↓ trimと必須検証
FormState
  ↓ useActionState
Client Componentの結果表示
```

## 観察ポイント

- 初期状態では結果要素が表示されないか
- titleが空または空白だけならエラーになるか
- description省略時と入力時で成功文言が変わるか
- 処理中にボタンがdisabledになり`送信中`と表示されるか
- URL遷移を伴わず同じ画面に結果が出るか
- 入力値がDBやファイルへ保存されていないか

## 壊して直す演習

1. `actions.ts`の`"use server"`を一時的に外し、ビルドまたは実行エラーを見る。
2. FormClientの`"use client"`を外し、Hook利用との関係を見る。
3. titleの`trim()`を外し、空白だけの入力結果を比較する。
4. `disabled={pending}`を外し、二重送信を防ぐUIの意味を考える。

## 自分の言葉で説明する

- BrowserからServer Actionを経て結果表示へ戻る流れを説明してください。
- `useActionState`が返す3つの値は何ですか。
- この構成でNestJS等の別APIを必要としない理由は何ですか。

## うまく動かないとき

- Hookのエラーでは、FormClientの`"use client"`を確認します。
- Actionが呼ばれない場合は、formのactionとactions.tsのexportを確認します。
- buildエラーでは、ClientからServer Actionをimportする境界と型を確認します。

## 学習完了の目安

- [ ] 空、titleのみ、descriptionありの3ケースを確認した
- [ ] Client/Server境界を説明できた
- [ ] `trim`またはdirectiveの故障を観察して直した
- [ ] `npm run build`が成功した
