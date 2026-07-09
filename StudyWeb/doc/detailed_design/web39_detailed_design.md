# web39 Error Boundary 詳細設計
## 0. 関連文書

- `../requirements/web39_error_boundary_requirements.md`
- `../basic_design/web39_basic_design.md`

## 1. 製造対象

```text
src/frontend/static/studyweb/systems/web39_error_boundary/
  Dockerfile
  app/index.html
  app/src/main.js
doc/learning_notes/web39_error_boundary/
  README.md
  docs/error_boundary_behavior.md
```

## 2. 主要設計
依存導入の最小版として、try/catch による fallback 表示で Error Boundary の考え方を確認する。React 本格版では `ErrorBoundary` コンポーネントへ置き換える。
| コンポーネント| 役割 |
|---|---|
| `ErrorBoundary` | render errorを捕捉しfallback表示 |
| `BuggyPanel` | 意図的例外を発生|
| `Fallback` | 利用者け復旧表示 |

## 3. 確認手順
1. 通常表示を確認する2. 例外発生ボタンを押い3. fallback UIを確認する4. reset/reloadで復旧する

## 4. 完了条件

- 画面全体が真っ白にならない
- 内部情報を出しすぎない
- Error Boundaryの限界を説明できる

