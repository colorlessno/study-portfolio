# base06 Git基本操作

## 目的

Git の基本操作を、差分確認と学習記録に使う練習です。

## 想定手順

```powershell
Set-Location ..\..\..\samples\base06_git_basic\practice_repo
git init
git status
git diff
git add README.md notes.txt .gitignore
git commit -m "Initial git basic practice"
git log --oneline
```

## 注意

このフォルダは練習用です。実際の `git init` は製造後に利用者が実行します。
