# web12 shadcn/ui風ダッシュボード

React、Tailwind CSS、lucide-reactで、管理画面のサイドバー、ヘッダー、指標カード、テーブルを組み立てるテーマです。shadcn/ui本体は使用せず、構成と見た目を学びます。

## このテーマでできるようになること

- 管理画面を役割別のReactコンポーネントへ分割できる
- propsと固定データから再利用可能な指標カードを描画できる
- Tailwindのブレークポイントで画面構成を切り替えられる
- 狭い画面でテーブルの可読性を保つ方法を説明できる

## 関連資料

1. [要件定義](../../requirements/web12_shadcn_dashboard_requirements.md)
2. [基本設計](../../basic_design/web12_basic_design.md)
3. [詳細設計](../../detailed_design/web12_detailed_design.md)
4. [App実装](../../../src/frontend/src/studyweb/systems/web12_shadcn_dashboard/src/App.tsx)

## 資料を見る前の確認問題

- 管理画面で情報をカードとテーブルに分ける理由は何ですか。
- Tailwindの`md`と`lg`は、どのような条件で適用されますか。
- テーブル全体を小さく縮めず、横スクロールさせる利点は何ですか。

## 15分で再開する

1. 開発サーバーを起動する。
2. 画面を広げ、Sidebar、Header、3枚のカード、表を確認する。
3. 画面を狭め、Sidebarとカードの並びが変わる幅を探す。
4. `App.tsx`から4つの子コンポーネントを辿る。

## 起動方法

実装ディレクトリで実行します。

```bash
npm install
npm run dev
```

型チェックと本番ビルドは`npm run build`で確認します。

## コードを読む順番

1. `src/App.tsx`で全体Gridと`stats`の反復描画を見る。
2. `components/AppSidebar.tsx`でメニューとアイコンを見る。
3. `components/Header.tsx`でFlexboxと操作要素を見る。
4. `components/StatCard.tsx`でpropsの型を見る。
5. `components/DataTable.tsx`でRow型、key、横スクロールを見る。

## 観察ポイント

- `lg`以上でSidebarが240pxの左列になるか
- `lg`未満でSidebarと本文が縦に並ぶか
- `md`以上で指標カードが3列になるか
- 560px未満でテーブル外枠内を横スクロールできるか
- メニュー、指標、テーブルで安定したkeyが使われているか
- lucide-reactのアイコンがメニュー識別の補助になっているか

## 壊して直す演習

1. `lg:grid`を一時的に外し、広い画面での構成差を見る。
2. 指標領域の`md:grid-cols-3`を外し、カードの並びを比較する。
3. DataTableの`overflow-x-auto`を外し、狭い画面のはみ出しを観察する。
4. `min-w-[560px]`を外し、列の読みやすさとの交換条件を確認する。

## 自分の言葉で説明する

- `App`と4つの子コンポーネントの責務を説明してください。
- Sidebarを常に横へ置かず、`lg`以上だけ2列にする理由は何ですか。
- 「shadcn/ui風」であってshadcn/ui本体ではない、とはどういう意味ですか。

## うまく動かないとき

- Tailwindが反映されない場合は、`index.css`、Tailwind設定、開発サーバーのログを確認します。
- アイコンが出ない場合は、lucide-reactのimportと依存関係を確認します。
- 表が画面全体を押し広げる場合は、wrapperの`overflow-x-auto`を確認します。

## 学習完了の目安

- [ ] 4コンポーネントの責務を説明できた
- [ ] `md`と`lg`の前後で表示を確認した
- [ ] テーブルの横スクロールを壊して直した
- [ ] `npm run build`が成功した
