# 対象選定

## 選定基準

| 基準 | 良い対象 |
| --- | --- |
| 見える結果 | 画面、command、API response、report、log |
| 説明できる構成 | componentとdata flowが明確 |
| 証拠がある | test、screenshot、docs、commit、logs |
| 範囲が小さい | 3分で説明できる |
| 正直な制限がある | 次の改善が明確 |

## 候補表

| 候補 | 結果 | 証拠 | risk |
| --- | --- | --- | --- |
| StudyDB db02 | SQL CRUD と join | SQL files、command output | 視覚的には弱い |
| StudyWeb sample | browser behavior | screenshot、route files | app起動が必要 |
| StudyAI system47 | 集計と説明 | SQL、prompt、sample output | AIが過大説明しやすい |

## 判断

scriptを書く前に、主対象とbackup対象を1つずつ選ぶ。
