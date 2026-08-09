# web23 Next.js App RouterのページとLayout

Next.js App Routerの`layout.tsx`、`page.tsx`、ディレクトリとURLの対応、`Link`による画面遷移を学ぶテーマです。

## このテーマでできるようになること

- `app`配下のディレクトリからURLを判断できる
- 共通Layoutとページ固有部分を分けられる
- `Link`を使ってクライアント遷移できる
- metadataとHTMLのlangを設定できる

## 関連資料

1. [要件定義](../../requirements/web23_next_pages_layout_requirements.md)
2. [基本設計](../../basic_design/web23_basic_design.md)
3. [詳細設計](../../detailed_design/web23_detailed_design.md)
4. [RootLayout](../../../src/frontend/src/studyweb/systems/web23_next_pages_layout/app/layout.tsx)
5. [トップページ](../../../src/frontend/src/studyweb/systems/web23_next_pages_layout/app/page.tsx)

## 資料を見る前の確認問題

- `/about`は`app`配下のどのファイルへ対応するでしょうか。
- Headerを各pageへ重複して書くと何が困りますか。
- 通常の`a`とNext.jsの`Link`は何が違いますか。

## 15分で再開する

1. 開発サーバーを起動する。
2. `/`、`/about`、`/tasks`を順に開く。
3. 共通HeaderとFooterが残ることを確認する。
4. URLと`app`ディレクトリを線で対応付ける。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run dev
```

表示されたURLをブラウザで開きます。`npm run build`でルートを含む本番ビルドを確認できます。

## コードを読む順番

1. `app/layout.tsx`でhtml、body、Header、children、Footerを見る。
2. `app/page.tsx`を`/`へ対応付ける。
3. `app/about/page.tsx`を`/about`へ対応付ける。
4. `app/tasks/page.tsx`で固定配列とlist描画を見る。
5. `globals.css`で共通表示を確認する。

## ルート対応

| URL | ファイル | 共通Layout |
|---|---|---|
| `/` | `app/page.tsx` | 適用される |
| `/about` | `app/about/page.tsx` | 適用される |
| `/tasks` | `app/tasks/page.tsx` | 適用される |

## 壊して直す演習

1. `app/about`を一時的に別名へ変えず、ディレクトリ名を変えた場合のURLを予想する。
2. Layoutの`{children}`を一時的に外し、ページ固有内容が消えることを確認する。
3. Tasksのkeyを固定値へ変え、Reactの警告を観察する。
4. Linkのhrefを未定義パスへ変え、Next.jsの404を確認する。

## 自分の言葉で説明する

- LayoutとPageの責務を説明してください。
- ディレクトリ構造からURLが決まる仕組みを3例で説明してください。
- 共通ナビゲーションをRootLayoutへ置く利点は何ですか。

## うまく動かないとき

- 404の場合は、URLと`app/{segment}/page.tsx`を照合します。
- 共通部分が出ない場合は、RootLayoutのreturnとchildrenを確認します。
- buildエラーでは、ReactNodeの型とLinkのimportを確認します。

## 学習完了の目安

- [ ] 3ルートを表示した
- [ ] URLとファイルの対応を図にした
- [ ] Layoutのchildrenの役割を確認した
- [ ] `npm run build`が成功した
