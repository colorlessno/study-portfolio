# 分野カタログ

[`fields.json`](./fields.json)は、[`../category/`](../category/)配下の学習分野を扱う機械可読カタログです。既存プロジェクトを管理画面へ依存させず、StudyHubとの安定した境界を提供します。

各分野では次を定義します。

- a stable ID, display name, directory, and learning entry file;
- its numbered-theme count;
- a unit kind: `document`, `exercise`, `implementation`, `application`, `shared-environment`, or `mixed`;
- one bounded check command and timeout;
- whether the check manages a temporary shared environment and its cleanup;
- a start guide when the field is a manually operated application.

Lifecycle modes:

- `check-only`: verification runs and exits without a separately managed service;
- `managed-check`: verification starts and cleans up its own temporary dependencies;
- `manual-app`: automated checks are available, while interactive startup and shutdown follow the linked guide.

Validate the catalog structure:

```powershell
node scripts/validate-study-catalog.mjs
```

List or run a field check:

```powershell
node scripts/run-study-check.mjs --list
node scripts/run-study-check.mjs --field StudyDevOps
```
