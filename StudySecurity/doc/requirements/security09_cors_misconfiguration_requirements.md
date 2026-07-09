# security09 CORS設定ミス体験 要件定義

## 1. 目的

CORSを許可しすぎる設定、拒否しすぎる設定、credentials設定の危険性を学ぶ。

## 2. 学習対象

- CORS misconfiguration
- wildcard origin
- credentials
- allowed origin
- preflight

## 3. 作成する成果物

- CORS設定比較サンプル
- 許可しすぎ例
- 拒否しすぎ例
- credentials注意メモ

## 4. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 許可originを限定できる |
| FR-02 | wildcard許可の危険性を説明できる |
| FR-03 | credentials併用時の注意を確認できる |
| FR-04 | 拒否しすぎによる業務影響を確認できる |

## 5. 非機能要件

| ID | 要件 |
|---|---|
| NFR-01 | StudyWebのCORS基礎との差分を明記する |
| NFR-02 | 本番での安易な全許可を避ける |
| NFR-03 | ローカル学習用に閉じる |

## 6. 対象外

- ブラウザ実装詳細
- OAuth
- CSRF本格対策

## 7. 受入条件

- CORSの許可しすぎ・拒否しすぎを説明できる
- credentials時の制約を説明できる
- 本番でoriginを限定する理由を説明できる

## 8. 学習観点

- CORSはセキュリティ境界の一部
- 開発用の全許可を本番へ持ち込まない
- Cookieあり通信では特に慎重に扱う
