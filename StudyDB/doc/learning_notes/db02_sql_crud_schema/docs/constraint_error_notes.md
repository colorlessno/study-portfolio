# constraint error notes

| case | expected error | note |
|---|---|---|
| duplicate email | unique violation | 同じemailを許可しない |
| null name | not-null violation | 必須値を守る |
| missing customer | foreign key violation | 存在しない親を参照しない |
| negative price | check violation | 業務的に不正な値を防ぐ |

