# base09 npm scripts

`package.json`を読み、`dev`、`build`、`test`、`start`が実際にどのコマンドを実行するか確認します。

## 到達目標

- script名と実行コマンドを対応付けられる。
- 開発実行、構文確認、test、通常実行の証拠を区別できる。
- npmエラーから失敗したscriptと原因候補を探せる。

## 教材

- [サンプルNodeプロジェクト](../../../src/samples/base09_npm_scripts/sample_node_project/)
- [package.json読解](notes/package_json_reading_note.md) / [コマンド記録](notes/npm_command_log.md) / [エラー](notes/npm_error_note.md)
- [要件定義](../../requirements/base09_npm_scripts_requirements.md) / [基本設計](../../basic_design/base09_basic_design.md) / [詳細設計](../../detailed_design/base09_detailed_design.md)

## 始める前の問い

- `npm run build`が成功すれば動作仕様も正しいと言えるか。
- `npm test`はpackage.jsonのどこを見て実行されるか。
- このサンプルに`npm install`が不要なのはなぜか。

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base09
```

個別に実行する場合:

```powershell
npm --prefix category/StudyBase\src\samples\base09_npm_scripts\sample_node_project run dev
npm --prefix category/StudyBase\src\samples\base09_npm_scripts\sample_node_project run build
npm --prefix category/StudyBase\src\samples\base09_npm_scripts\sample_node_project test
npm --prefix category/StudyBase\src\samples\base09_npm_scripts\sample_node_project start
```

## 完了条件

4つのscriptについて、実行コマンド、成功の証拠、検証していない範囲を説明できれば完了です。
