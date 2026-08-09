# db02 要件定義
## SQL CRUD とスキーマ基礎

## 1. 目的

RDBの基本操作である SELECT / INSERT / UPDATE / DELETE と、テーブル、カラム、型、制約、主キー、外部キーの意味を理解する。

## 2. 学習対象

- SQL CRUD
- テーブルとカラム
- データ型
- 主キー、外部キー、一意制約、NOT NULL
- JOIN の入口
- schema と seed data

## 3. 機能要件

| ID | 要件 |
|---|---|
| FR-01 | 顧客、商品、注文の最小テーブルを作る |
| FR-02 | CRUD SQL を実行できるサンプルを用意する |
| FR-03 | 主キー、外部キー、一意制約、NOT NULL の違いを確認する |
| FR-04 | INNER JOIN / LEFT JOIN の最小例を用意する |
| FR-05 | 不正データ投入時のエラーを確認する |

## 4. 非機能要件

- SQLは製品依存の少ない基本構文を優先する。
- 後続で PostgreSQL を使う場合も、まず概念を優先する。
- 作成するテキストファイルは UTF-8 BOMなしとする。

## 5. 対象外

- ORMの詳細
- 複雑な集計SQL
- DBチューニング

## 6. 成果物

```text
category/StudyDB/
  doc/requirements/db02_sql_crud_schema_requirements.md
  doc/basic_design/db02_basic_design.md
  doc/detailed_design/db02_detailed_design.md
  doc/learning_notes/db02_sql_crud_schema/
```

## 7. 受入条件

- CRUD SQL の意味を説明できる。
- schema、primary key、foreign key、constraint の役割を説明できる。
- アプリの入力がDBに保存される流れを追える。
