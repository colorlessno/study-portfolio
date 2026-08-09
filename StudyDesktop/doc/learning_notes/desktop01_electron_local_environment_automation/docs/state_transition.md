# 状態遷移

## task状態

| 状態 | 意味 | 次の状態 |
| --- | --- | --- |
| `idle` | 実行中taskなし | `queued` |
| `queued` | task IDを受理した | `running`, `rejected` |
| `running` | child process起動済み | `completed`, `failed`, `cancelling` |
| `cancelling` | userの停止要求を受理した | `cleaning` |
| `cleaning` | child process停止後にrun単位の後片付けを実行中 | `cancelled` |
| `completed` | exit code が0 | `idle` |
| `failed` | exit codeが非0、またはspawn失敗 | `idle` |
| `cancelled` | userが停止した | `idle` |
| `rejected` | task IDがallowlistにない | `idle` |

## log項目

| 項目 | 例 |
| --- | --- |
| `taskId` | `safe-install-plan` |
| `runId` | `20260507-143000-safe-install-plan` |
| `status` | `completed` |
| `startedAt` | ISO timestamp |
| `finishedAt` | ISO timestamp |
| `exitCode` | `0` |
| `workspace` | app workspace subdirectory |

## 失敗時の扱い

失敗時は、原因説明に必要な証拠を残す。ただし、後続taskが不完全な状態を自動再利用しないようにする。
