# concurrent update log

| step | session A | session B | observation |
|---|---|---|---|
| 1 | BEGIN |  |  |
| 2 | update product id=1 |  | row lock held |
| 3 |  | BEGIN and update product id=1 | waits |
| 4 | COMMIT/ROLLBACK | continues | result changes by A decision |

