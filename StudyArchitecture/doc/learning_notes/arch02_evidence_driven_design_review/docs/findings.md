# 指摘

## 指摘format

```text
[Severity] Title

Impact:
user、learner、operator のどの結果が危険か。

Evidence:
file path、command output、log、観察結果。

Recommendation:
riskを下げる最小の変更または検証step。
```

## severity

| severity | 意味 |
| --- | --- |
| High | 破損、data loss、security issue、復旧不能なsetup failure |
| Medium | 影響範囲が限定された実bugまたはguard不足 |
| Low | maintainability または clarity のrisk |

## 指摘しないもの

具体的なriskを作らない好みは、指摘として扱わない。
