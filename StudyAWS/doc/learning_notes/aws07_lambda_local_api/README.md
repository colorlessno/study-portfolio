# aws07 Lambda最小API

Lambda handlerをNode.jsから直接呼び、event、context、responseの境界を確認します。標準経路ではSAM CLI、Docker、AWS認証情報を使いません。

## 到達目標

- handlerの入力と戻り値を説明できる。
- event内の値が欠けた場合の既定動作を予想できる。
- ローカル直接呼出しとLambda実行環境の違いを列挙できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws07_lambda_local_api/)
- [eventメモ](docs/lambda_event_notes.md)
- [要件定義](../../requirements/aws07_lambda_local_api_requirements.md) / [基本設計](../../basic_design/aws07_basic_design.md) / [詳細設計](../../detailed_design/aws07_detailed_design.md)

## 15分で再開

```powershell
node StudyAWS\scripts\validate-studyaws.mjs aws07
npm --prefix StudyAWS\src\backend\src\studyaws\systems\aws07_lambda_local_api run invoke
```

`events/hello.json`のnameとbodyを変え、responseのどこが変わるか予想してから実行します。

SAM CLIとDockerがある場合だけ、追加でローカルinvokeできます。

```powershell
sam local invoke HelloFunction -t StudyAWS\src\infra\aws07_lambda_local_api\template.yaml -e StudyAWS\src\backend\src\studyaws\systems\aws07_lambda_local_api\events\hello.json
```

## 境界と完了条件

直接呼出しはIAM role、timeout、memory、cold start、CloudWatch、同時実行を再現しません。`sam deploy`や実Lambda作成はこの手順に含みません。入力、出力、失敗時の扱いを説明できれば完了です。
