# aws02 Security Group / port

Docker Composeの`ports`と`expose`を使い、外部公開とサービス間通信を観察します。Security Groupそのものを再現する教材ではありません。

## 到達目標

- ingressとegress、送信元、宛先portを表にできる。
- hostへ公開するportとコンテナ内部だけのportを区別できる。
- `0.0.0.0/0`を安易に許可する危険性を説明できる。

## 教材

- [実装](../../../src/backend/src/studyaws/systems/aws02_security_group_port/)
- [通信表](docs/network_matrix.md) / [危険なルール](docs/dangerous_rules.md)
- [要件定義](../../requirements/aws02_security_group_port_requirements.md) / [基本設計](../../basic_design/aws02_basic_design.md) / [詳細設計](../../detailed_design/aws02_detailed_design.md)

## 15分で再開

```powershell
node category/StudyAWS\scripts\validate-studyaws.mjs aws02
```

Docker Desktopがある場合だけ、リポジトリルートから追加観察します。

```powershell
docker compose -f category/StudyAWS\src\backend\src\studyaws\systems\aws02_security_group_port\docker-compose.yml up -d
Invoke-RestMethod http://localhost:4102
docker compose -f category/StudyAWS\src\backend\src\studyaws\systems\aws02_security_group_port\docker-compose.yml exec -T web node -e "fetch('http://api:5102').then(r => r.text()).then(console.log)"
docker compose -f category/StudyAWS\src\backend\src\studyaws\systems\aws02_security_group_port\docker-compose.yml down
```

実行前にhostから4102と5102へ到達できるかを予想し、通信表へ結果を記録します。

## 境界と完了条件

Dockerのport mappingはSecurity Groupと同一ではありません。実AWSではVPC、subnet、route、NACL、Security Group、OS firewallも確認します。公開すべき通信と閉じる通信を理由付きで分類できれば完了です。
