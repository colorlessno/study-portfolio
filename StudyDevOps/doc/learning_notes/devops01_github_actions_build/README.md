# devops01 GitHub Actions build

GitHub Actions の build workflow と同じ流れをローカルと Docker で確認する教材。
## Local

```powershell
npm.cmd --prefix src/apps/devops01_github_actions_build/app run build
```

## Docker

```powershell
docker build -t studydevops-devops01 src/apps/devops01_github_actions_build
docker run --rm studydevops-devops01
```

## Checkpoints

- checkout
- runtime setup
- dependency install
- build
- build log review

secrets、token、password、個人情は使わない
