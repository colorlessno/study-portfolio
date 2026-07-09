# StudyWeb web32-web51 詳細設計一覧

成日: 2026-04-29

## 目的
`web32`〜`web51` の基本設計を、製造・環境築で成するファイル、API、画面、確認手順落とし込む。
## 対象ーブル
| No | 基本設計| 詳細設計|
|---|---|---|
| web32 | `../basic_design/web32_basic_design.md` | `web32_detailed_design.md` |
| web33 | `../basic_design/web33_basic_design.md` | `web33_detailed_design.md` |
| web34 | `../basic_design/web34_basic_design.md` | `web34_detailed_design.md` |
| web35 | `../basic_design/web35_basic_design.md` | `web35_detailed_design.md` |
| web36 | `../basic_design/web36_basic_design.md` | `web36_detailed_design.md` |
| web37 | `../basic_design/web37_basic_design.md` | `web37_detailed_design.md` |
| web38 | `../basic_design/web38_basic_design.md` | `web38_detailed_design.md` |
| web39 | `../basic_design/web39_basic_design.md` | `web39_detailed_design.md` |
| web40 | `../basic_design/web40_basic_design.md` | `web40_detailed_design.md` |
| web41 | `../basic_design/web41_basic_design.md` | `web41_detailed_design.md` |
| web42 | `../basic_design/web42_basic_design.md` | `web42_detailed_design.md` |
| web43 | `../basic_design/web43_basic_design.md` | `web43_detailed_design.md` |
| web44 | `../basic_design/web44_basic_design.md` | `web44_detailed_design.md` |
| web45 | `../basic_design/web45_basic_design.md` | `web45_detailed_design.md` |
| web46 | `../basic_design/web46_basic_design.md` | `web46_detailed_design.md` |
| web47 | `../basic_design/web47_basic_design.md` | `web47_detailed_design.md` |
| web48 | `../basic_design/web48_basic_design.md` | `web48_detailed_design.md` |
| web49 | `../basic_design/web49_basic_design.md` | `web49_detailed_design.md` |
| web50 | `../basic_design/web50_basic_design.md` | `web50_detailed_design.md` |
| web51 | `../basic_design/web51_basic_design.md` | `web51_detailed_design.md` |

## 後続工程
次工程では `web32_*` 。`web51_*` の製造・環境築を行う。成移行後の製造物は、対象番号の実行単位に応じて `src/backend/src/studyweb/systems/`、`src/frontend/src/studyweb/systems/`、`src/frontend/static/studyweb/systems/`、`doc/learning_notes/` へ配置する。Dockerに入れられるサンプルは、Node系は`node:20-alpine`。的HTML系は`nginx:1.27-alpine`の`Dockerfile`を製造対象に含める。製造へ進む前に、ユーザー確認を受ける。
