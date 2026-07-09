# base07 branch / merge / conflict

## 目的

branch、merge、conflict解消を小さいテキスト変更で練習します。

## 想定手順

```powershell
Set-Location ..\..\..\samples\base07_branch_merge_conflict\practice_repo
git init
git add README.md conflict_target.txt
git commit -m "Initial conflict practice"
git switch -c feature/a
# conflict_target.txt の同じ行を変更
git commit -am "Change target on feature"
git switch main
# conflict_target.txt の同じ行を別内容へ変更
git commit -am "Change target on main"
git merge feature/a
```
