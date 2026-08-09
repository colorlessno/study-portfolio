# Study area catalog

[`study-areas.json`](./study-areas.json) is the machine-readable index for the learning areas under [`../category/`](../category/). It gives StudyHub a stable boundary without coupling the existing projects to a management application.

Each area defines:

- a stable ID, display name, directory, and learning entry file;
- its numbered-theme count;
- a unit kind: `document`, `exercise`, `implementation`, `application`, `shared-environment`, or `mixed`;
- one bounded check command and timeout;
- whether the check manages a temporary shared environment and its cleanup;
- a start guide when the area is a manually operated application.

Lifecycle modes:

- `check-only`: verification runs and exits without a separately managed service;
- `managed-check`: verification starts and cleans up its own temporary dependencies;
- `manual-app`: automated checks are available, while interactive startup and shutdown follow the linked guide.

Validate the catalog structure:

```powershell
node scripts/validate-study-catalog.mjs
```

List or run an area check:

```powershell
node scripts/run-study-check.mjs --list
node scripts/run-study-check.mjs --area StudyDevOps
```
