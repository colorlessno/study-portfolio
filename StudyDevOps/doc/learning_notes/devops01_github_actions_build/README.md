# devops01 GitHub Actions build

目安: 15〜30分。GitHub Actionsのstepとローカルコマンドを対応付け、buildログをCIの最小証拠として読めるようにします。

## このテーマでできるようになること

- checkout、Node.js準備、依存関係復元、buildの順序を説明する。
- ローカル、Docker、GitHub Actionsで同じ`npm run build`を使う理由を説明する。
- workflowのどのstepで失敗したかをログから切り分ける。

## 成果物

- [要件定義](../../requirements/devops01_github_actions_build_requirements.md)
- [基本設計](../../basic_design/devops01_basic_design.md)
- [詳細設計](../../detailed_design/devops01_detailed_design.md)
- [アプリ](../../../src/apps/devops01_github_actions_build/app/src/index.js)
- [実際のCI workflow](../../../../.github/workflows/studydevops-ci.yml)

## 始める前に予想する

1. `npm ci`と`npm run build`を別stepにする利点は何か。
2. ローカルで成功してCIで失敗するとき、最初に比較する環境情報は何か。

## 15分で再開する

リポジトリルートから実行します。

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops01_github_actions_build/app ci
npm.cmd --prefix StudyDevOps/src/apps/devops01_github_actions_build/app run build
```

`app`、`build`、`checkedAt`を持つJSONが出れば成功です。`checkedAt`は実行時刻なので、固定値との完全一致をテストする対象ではありません。

Dockerが使える場合は、同じscriptがコンテナでも動くことを確認します。

```powershell
docker build -t studydevops-devops01 StudyDevOps/src/apps/devops01_github_actions_build
docker run --rm studydevops-devops01
```

## 読む順番と観察点

1. 要件定義でCIに必要な機能と対象外を確認する。
2. workflowの`node-quality` jobを読み、各`working-directory`を追う。
3. `package.json`の`build`がどのソースを呼ぶか確認する。
4. 実行結果とGitHubのstepログを比較する。

特に、依存関係の失敗とbuild scriptの失敗が別stepになる点を観察します。

## 安全に壊して直す

作業ブランチで`package.json`のbuild対象を一時的に存在しないファイル名へ変え、どのstepとログで失敗するか確認します。確認後は元へ戻し、再実行して成功させます。secret、token、password、個人情報はworkflowやログへ入れません。

## 説明してみる

- なぜ`package-lock.json`がCIの再現性に必要か。
- なぜworkflow専用コマンドではなく、ローカルでも使うscriptをCIから呼ぶのか。

## 完了条件

- [ ] ローカルbuildが成功した。
- [ ] workflowの4段階を自分の言葉で説明した。
- [ ] 失敗させたstepと原因を記録し、元に戻して成功を確認した。
