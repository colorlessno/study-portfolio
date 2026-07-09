# devops02 lint / unit test

lint と unit test を分けて実行し、失敗箇所を切り分ける教材。

```powershell
npm.cmd --prefix src/apps/devops02_lint_unit_test run lint
npm.cmd --prefix src/apps/devops02_lint_unit_test test
npm.cmd --prefix src/apps/devops02_lint_unit_test run check
```

Docker:

```powershell
docker build -t studydevops-devops02 src/apps/devops02_lint_unit_test
docker run --rm studydevops-devops02
```

secrets、token、password、個人情報は扱わない。
