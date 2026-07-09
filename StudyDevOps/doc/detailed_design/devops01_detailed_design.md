# devops01 詳細設計

## GitHub Actions build

## 1. 実装配置

```text
src/apps/devops01_github_actions_build/
  README.md
  .github/workflows/build.yml
  app/package.json
  app/src/index.js
  Dockerfile
```

## 2. workflow設計

`build.yml`:

```yaml
name: build
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
        working-directory: app
      - run: npm run build
        working-directory: app
```

## 3. package scripts

| script | コマンド | 目的 |
|---|---|---|
| `build` | `node src/index.js` | CI build の最小代替 |
| `check` | `npm run build` | ローカルとCIの共通入口 |

## 4. Docker設計

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY app/package*.json ./
RUN npm ci
COPY app ./
CMD ["npm", "run", "build"]
```

## 5. 検証コマンド

```powershell
npm.cmd --prefix .\src\apps\devops01_github_actions_build\app run build
docker build -t studydevops-devops01 .\src\apps\devops01_github_actions_build
docker run --rm studydevops-devops01
```

## 6. エラー確認観点

| 失敗箇所 | 見るログ |
|---|---|
| checkout | repository / path |
| setup-node | Node.js version |
| npm ci | lockfile / dependency |
| build | script / compile output |

## 7. 安全性

- secrets は使わない。
- workflow に token、password、個人情報を記載しない。
- テキストファイルは UTF-8 BOMなしで保存する。
