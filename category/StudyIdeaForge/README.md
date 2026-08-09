# StudyIdeaForge

AIと人間が協働してアイデアを育てる発想支援アプリケーション「IdeaForge」を収録しています。発想法をノードとしてグラフ化し、生成結果の採用、修正、再生成を人間が判断しながら進めます。

## IdeaForge

- [概要・起動方法](./ideaforge/README.md)
- [15分の再開手順](./ideaforge/README.md#15分で再開するllmなし)
- [構成とテスト方針](./ideaforge/README.md#構成と責務)
- [バックエンド](./ideaforge/backend/)
- [フロントエンド](./ideaforge/frontend/)

主な技術はFastAPI、SQLite、React、Viteです。LLM実行にはOpenAI互換APIを使用し、LM Studio等のローカルLLMも接続できます。

このプロジェクトは番号付き教材とは異なり、1つのアプリケーションを題材に、AIワークフロー、状態保存、画面操作、LLM連携を横断して確認する位置付けです。

リポジトリルートから次を実行すると、LLM、API key、外部package、実アプリDBを使わずにSQLiteの初期化と状態保存を確認できます。

```powershell
python -m unittest discover -s category/StudyIdeaForge\ideaforge\backend\tests -v
```
