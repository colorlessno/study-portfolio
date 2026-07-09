# transaction log

| case | before | action | after | note |
|---|---|---|---|---|
| commit | stock exists | order + stock update | stock decreases | transaction persisted |
| rollback | stock exists | failing order insert | original state | failed transaction reverted |

