# 承認境界

## 自動でよいもの

- read-only検査
- format check
- sample fixtureの比較
- 生成物の静的確認

## 人間承認が必要なもの

- 外部serviceへの書き込み
- secretやcredentialを扱う操作
- 大量file削除や移動
- 本番dataに影響する変更

## 目的

AIができることを増やす前に、何を自動化し、何を承認制にするかを決める。
