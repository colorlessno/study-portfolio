# web44 注文ステータス遷移

注文状態を自由に書き換えず、現在状態ごとの許可遷移表で業務ルールを判定する静的サンプル。許可された遷移、不正遷移、終端状態、簡易履歴を画面で確認する。

## このテーマで身につけること

- CRUDだけでは表しにくい業務ルールを状態遷移として整理する
- 現在状態と変更先の組合せから遷移可否を判定する
- 入力形式エラーと業務上許可されない遷移を区別する
- 完了・取消など、次の遷移を持たない終端状態を扱う

## 10分で再開する

Dockerで静的画面を配信する。

```powershell
cd category/StudyWeb\src\frontend\static\studyweb\systems\web44_order_status_transition
docker build -t studyweb-web44 .
docker run --rm -p 3044:80 studyweb-web44
```

`http://localhost:3044/app/` を開く。終了は `Ctrl+C`。

簡単な確認なら `app/index.html` を直接開ける。構文確認は次を使う。

```powershell
node --check app/src/main.js
```

## 最初に試す順番

1. 初期状態が`draft`、履歴が`draft`だけであることを確認する
2. `shipped`を選び、不正遷移の業務エラーを確認する
3. `confirmed`へ遷移し、状態と履歴が更新されることを見る
4. `draft`へ戻ろうとして拒否されることを確認する
5. `shipped` → `completed`と進める
6. completedから別状態へ進めず、終端状態であることを確認する

許可関係は [Status Transition](docs/status_transition_table.md)、操作例は [Transition Check](docs/transition_check.md) を参照する。

## コードを読む順番

1. `order`の初期statusとhistoryを見る
2. `allowed`で、各statusから進める変更先を確認する
3. `render`でmessage、status、historyの表示方法を見る
4. click handlerでselectの値を取得する箇所を見る
5. `includes`による遷移可否判定と早期returnを追う
6. 許可時だけstatusとhistoryを更新する順番を見る

## 状態遷移

```text
draft ──> confirmed ──> shipped ──> completed
  └────────> canceled <────┘
```

`completed`と`canceled`は終端状態である。画面を再読み込みすると初期`draft`へ戻る。

## 現実装の範囲

- JavaScript内の1注文だけを扱い、API・DBへ保存しない
- 不正遷移は画面上の文字列であり、HTTP statusを返す業務APIではない
- historyはstatus文字列だけで、日時・操作者・理由を記録しない
- selectには現在許可されていない変更先も表示し、実行時に拒否する
- 取消理由、権限、在庫・決済等の実務ルールは対象外

## 壊して確かめる

- `draft -> completed`を試し、拒否後に状態・履歴が変わらないことを確認する
- 現在状態に応じてselectの選択肢を許可遷移だけに絞る
- historyを`{ from, to, changedAt, reason }`形式へ変更する
- canceledからconfirmedへ戻せるようにし、業務上の問題を考える
- 遷移判定を純粋関数へ分離し、許可・不許可を自動テストする
- API化する場合のstatus codeとerror codeを設計する

## 自分の言葉で説明する

- 状態を任意文字列として直接更新してはいけない理由は何か
- validation errorとbusiness rule errorは何が違うか
- 終端状態は遷移表でどのように表すか
- 遷移履歴に日時・操作者・理由が必要になるのはなぜか

## 完了条件

- 許可遷移と不正遷移をそれぞれ再現した
- completedまたはcanceledまで進み、終端状態を確認した
- 不正遷移時にstatusとhistoryが変わらないことを説明できる
- 遷移判定のテストまたは履歴項目を1つ以上改善した
