# 失敗mode

## 失敗表

| 失敗 | 見える症状 | 疑うcomponent | 確認する証拠 |
| --- | --- | --- | --- |
| service未起動 | connection refused | runtime service | compose ps、logs |
| routeなし | 404 | entry route | route file |
| DB利用不可 | 500 または startup failure | DB service | logs、connection config |
| input不正 | validation error | route または service | request schema |
| buildが古い | 期待と違う古い動作 | build artifact | image tag、bundle timestamp |

## 確認質問

- systemは fail closed か、partial behavior で動き続けるか。
- errorはuser、operator、logのどこに見えるか。
- recovery actionは文書化されているか。

## output

症状、component、証拠、復旧actionをつなげた失敗storyを1つ書く。
