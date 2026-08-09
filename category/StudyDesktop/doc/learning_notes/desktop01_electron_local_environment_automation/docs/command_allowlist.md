# コマンド allowlist

## 許可taskの形

各taskは以下で定義する。

| 項目 | 意味 |
| --- | --- |
| `id` | 安定したtask識別子 |
| `label` | 表示名 |
| `command` | アプリ側が所有する実行ファイル |
| `args` | 固定引数、または安全に生成したpath |
| `workspaceMode` | workspace directory の扱い |

## MVP task

| task | 目的 | 副作用 |
| --- | --- | --- |
| `safe-install-plan` | install plan を模擬表示する | `workspace/` 配下にplan fileを書く |
| `safe-cleanup-preview` | cleanup対象の一覧を模擬表示する | 削除候補を表示するだけ |

## 拡張ルール

実setup taskを追加する前に、以下を定義する。

1. 正確なcommandと固定引数。
2. working directory。
3. output path。
4. timeout。
5. cleanup rule。
6. 無関係なlocal pathを露出しない失敗message。

user inputが必要な場合は、dataとして検証してから、app workspace配下の絶対pathへ変換する。
