# Status Code Matrix

| Status | Meaning | Endpoint |
|---|---|---|
| 200 | OK | `/items` |
| 201 | Created | `POST /items` |
| 400 | Bad Request | `/bad-request` |
| 401 | Unauthorized | `/private` |
| 403 | Forbidden | `/admin` |
| 404 | Not Found | `/items/999` |
| 409 | Conflict | `/duplicate` |
| 500 | Internal Error | `/error` |
