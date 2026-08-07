# devops02 詳細設計

## lint / unit test

## 1. 実装配置

```text
StudyDevOps/src/apps/devops02_lint_unit_test/
  package.json
  package-lock.json
  src/calculator.js
  test/calculator.test.js
  Dockerfile
```

## 2. scripts設計

| script | コマンド | 目的 |
|---|---|---|
| `lint` | `node scripts/lint.js` | 禁止文字列や末尾空白を検知 |
| `test` | `node --test` | unit test 実行 |
| `check` | `npm run lint && npm test` | CI / Docker 共通確認 |

## 3. unit test設計

| case | 入力 | 期待 |
|---|---|---|
| add normal | `add(2, 3)` | `5` |
| divide normal | `divide(6, 2)` | `3` |
| divide by zero | `divide(1, 0)` | 例外 |

## 4. Docker設計

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "check"]
```

## 5. CI設計

```text
checkout -> setup node -> npm ci -> npm run lint -> npm test
```

lint と unit test は step を分け、どちらで失敗したかログで判断できるようにする。

## 6. 検証コマンド

```powershell
npm.cmd --prefix StudyDevOps/src/apps/devops02_lint_unit_test run check
docker build -t studydevops-devops02 StudyDevOps/src/apps/devops02_lint_unit_test
docker run --rm studydevops-devops02
```

## 7. 安全性

- secrets は使わない。
- test data に token、password、個人情報を含めない。
- テキストファイルは UTF-8 BOMなしで保存する。
