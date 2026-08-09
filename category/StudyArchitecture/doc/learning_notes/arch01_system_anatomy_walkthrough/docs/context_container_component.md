# context / container / component の整理

## Context

| actor | 目的 | 証拠 |
| --- | --- | --- |
| learner | sampleを実行・確認する | README、scripts |
| browser または client | requestを送る | route、page、curl command |
| runtime service | 動作を提供する | Dockerfile、compose、package config |

## Container

| container | 責務 | 証拠 |
| --- | --- | --- |
| Web app | UIまたはHTTP動作 | route files |
| API service | business behavior | router/controller files |
| DBまたはstorage | 永続状態 | schema、migrations、volume |

## Component

選んだ動作に必要なcomponentだけを書く。

| component | 責務 | 証拠 |
| --- | --- | --- |
| entry route | requestを受ける | file path と該当箇所 |
| service function | ruleを適用する | file path と該当箇所 |
| repository または SQL | dataを読む/書く | file path と該当箇所 |

## ルール

証拠がないものは、事実としてdiagramに入れず、推測として書く。
