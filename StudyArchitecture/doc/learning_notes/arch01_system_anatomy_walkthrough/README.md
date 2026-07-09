# arch01 システム構造の読み解き

## 目的

小さなシステムを証拠から読み取り、なぜその構成になっているかを説明する力を身につける。

この単元は system anatomy 系の正規ルートである。`StudyBase base12` は重複候補として残すが、実装はここから始める。

## 学習順

1. 小さな StudyWeb または StudyDevOps サンプルを対象に選ぶ。
2. `docs/target_system_summary.md` を埋める。
3. `docs/context_container_component.md` で context / container / component 境界を整理する。
4. `docs/request_data_flow.md` で1つの request または job を追跡する。
5. `docs/failure_mode.md` に失敗modeを書く。
6. `docs/evidence_vs_inference.md` で事実と推測を分ける。
7. `docs/decision_notes.md` に構成判断をまとめる。
8. `docs/example_devops07_system_anatomy.md` の記入例と比較する。

## 証拠source

- repository files
- Docker Compose service names
- API routes
- database tables または SQL
- logs と health checks
- browser または curl の観察結果
- 記入例: `docs/example_devops07_system_anatomy.md`

## 完了条件

- 主なdiagram上の主張に証拠がある。
- 推測は推測として明記する。
- 少なくとも1つのtradeoffと1つの失敗modeを説明する。
