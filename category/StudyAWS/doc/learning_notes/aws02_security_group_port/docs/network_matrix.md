# 通信マトリクス

| From | To | Port | 公開 | AWSでの考え方 |
|---|---|---:|---|---|
| Internet | Web | 4102 | yes | HTTP/HTTPSだけ公開 |
| Web | API | 5102 | no | WebのSGからのみ許可 |
| Internet | DB | 5432 | no | 外部公開しない |
