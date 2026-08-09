# System 11 要件定義
## ローカルPCファイル自動整理エージェント

---

## システム概要

ローカルPC内の指定フォルダを監視・分析し、ファイルの種別・内容・更新日をもとにLLMが整理方針を判断して自動分類・リネーム・アーカイブを行うエージェント。MCPのfilesystemサーバーを活用してファイルシステムを操作する。「ダウンロードフォルダが散らかりっぱなし」「デスクトップが混沌としている」状態を自動で解消する。

---

## 現状の課題

- ダウンロードフォルダ・デスクトップにファイルが溜まり続けて管理できない
- ファイル名が意味不明で内容がわからない（スクリーンショット・ダウンロードファイル等）
- 同じファイルが複数箇所に重複して存在する
- 古いファイルをいつ削除していいかわからず溜まり続ける
- 手動で整理する時間がなく、後回しにしてしまう

---

## 対象ユーザー

- ローカルPCのファイル管理に困っている個人ユーザー
- 大量のファイルを扱う開発者・デザイナー・ライター

---

## 機能要件

### 1. 監視フォルダ設定機能
整理対象のフォルダを設定する。

**設定項目**

| 項目 | 説明 |
|------|------|
| 監視フォルダ | 整理対象のフォルダパス（複数指定可） |
| 整理先フォルダ | 分類後のファイルを移動するフォルダ |
| 除外パターン | 整理対象外のファイル・フォルダパターン |
| 実行モード | 自動実行 / 提案のみ（人間が承認して実行） |
| 実行スケジュール | 毎日・毎週・手動のみ |

**推奨設定例**
```
監視フォルダ：
  - C:\Users\username\Downloads
  - C:\Users\username\Desktop

整理先フォルダ：
  - C:\Users\username\Organized

除外パターン：
  - *.exe（実行ファイルは移動しない）
  - .git（Gitリポジトリは除外）
  - node_modules
```

### 2. ファイル分析機能（LLM + MCP）
MCPのfilesystemサーバー経由でファイルを読み取り、LLMが内容を分析する。

**分析内容**

| 項目 | 説明 |
|------|------|
| ファイル種別 | ドキュメント・画像・動画・音声・コード・データ・アーカイブ等 |
| 内容の推定 | ファイル名・拡張子・テキスト内容から推定 |
| プロジェクト推定 | どのプロジェクト・業務に関連するか |
| 重要度 | 高・中・低（最終更新日・アクセス頻度・内容から判定） |
| 重複判定 | 同一または類似ファイルの有無 |
| アーカイブ推奨 | 長期間アクセスされていないファイルのアーカイブ提案 |

**対応ファイル形式（内容分析）**
- テキスト系：PDF・Word・テキスト・Markdown・コードファイル
- その他：ファイル名・拡張子・更新日のみで分析

### 3. 整理方針決定機能（LLM）
分析結果をもとにLLMが整理方針を決定する。

**整理アクションの種類**

| アクション | 説明 |
|-----------|------|
| 分類移動 | カテゴリ別のフォルダに移動 |
| リネーム | 内容を反映した意味のあるファイル名に変更 |
| アーカイブ | 古いファイルをアーカイブフォルダに移動 |
| 重複削除提案 | 重複ファイルの削除を提案（実行は人間が承認） |
| スキップ | 整理対象外と判断してそのまま残す |

**自動分類フォルダ構成例**
```
Organized/
├── Documents/
│   ├── 2024/
│   │   ├── 契約書/
│   │   ├── 議事録/
│   │   └── 報告書/
│   └── 2023/
├── Images/
│   ├── スクリーンショット/
│   └── 写真/
├── Code/
│   ├── Python/
│   └── JavaScript/
├── Data/
│   ├── CSV/
│   └── Excel/
└── Archive/
    └── 2023以前/
```

### 4. 実行前プレビュー・承認機能（Human-in-the-loop）
整理アクションを実行前にユーザーに提示し、承認を得てから実行する。

**プレビュー内容**
- 実行予定のアクション一覧
- 移動元・移動先のパス
- リネーム前後のファイル名
- アーカイブ・削除対象のファイル一覧
- 推定される影響（移動ファイル数・削除容量など）

**承認モード**
- 全件承認（一括実行）
- 件別承認（1件ずつ確認）
- カテゴリ別承認（種別ごとに確認）

### 5. 実行機能（MCP）
MCPのfilesystemサーバー経由でファイル操作を実行する。

**実行できる操作**
- ファイルの移動
- ファイルのリネーム
- フォルダの作成
- ファイルのアーカイブ（圧縮）

**実行できない操作（安全のため禁止）**
- ファイルの完全削除（ゴミ箱への移動のみ提案）
- システムフォルダへの操作
- 実行ファイル（.exe・.bat等）の移動

**安全実行ルール**
- 実行はファイル単位で行い、各ファイルの成功 / 失敗 / スキップを個別に記録する
- 移動先に同名ファイルが存在する場合は上書きせず、`競合` として停止する
- 他プロセスが使用中のファイルは `ロック中` としてスキップし、実行結果に残す
- シンボリックリンク・ジャンクション・ショートカットは自動操作対象外とする
- パスは Windows の絶対パスとして正規化し、監視フォルダ配下かどうかを判定してから実行する

### 6. 実行ログ・ロールバック機能
- 実行したすべての操作をログに記録する
- 直前の整理操作を元に戻せる（ロールバック）
- ロールバックは直近10回分まで対応
- 部分成功時は成功した操作のみをロールバック対象にする
- 失敗・スキップされたファイルはロールバック対象に含めない

### 7. 定期実行・スケジュール機能
- 指定したスケジュールで自動実行
- 実行結果のサマリーをログに記録
- 実行後に整理結果レポートを生成

---

## 非機能要件

| 項目 | 要件 |
|------|------|
| 処理速度 | 1,000ファイルあたり5分以内 |
| 安全性 | 操作前に必ずバックアップログを記録。完全削除は行わない |
| セキュリティ | ファイル内容はローカル処理のみ。外部送信なし |
| 対応OS | Windows 11 |
| 動作環境 | 完全ローカル（インターネット接続不要） |
| 実行単位 | 実行結果はファイル単位で記録し、部分失敗を許容する |

---

## システム構成

```
スケジューラ（APScheduler）または手動実行
        ↓
    FastAPI（ローカルAPIサーバー）
        ↓
    MCPのfilesystemサーバー
    （監視フォルダのファイル一覧取得）
        ↓
    ファイル分析
    （テキスト抽出・メタ情報収集）
        ↓
    LLM（整理方針決定）
    ※ Qwen3-27B / LM Studio
        ↓
    整理プラン生成
        ↓
    ┌─────────────────────────────┐
    │  Human-in-the-loop         │
    │  プレビュー提示 → 承認待ち  │
    │  承認されたら実行           │
    └─────────────────────────────┘
        ↓
    MCPのfilesystemサーバー
    （ファイル移動・リネーム・フォルダ作成）
        ↓
    実行ログ保存・ロールバック情報記録
        ↓
    整理結果レポート生成
```

---

## API仕様

### POST /scan
監視フォルダをスキャンして整理プランを生成する。

**リクエスト（JSON）**
```json
{
  "watch_folders": [
    "C:/Users/username/Downloads",
    "C:/Users/username/Desktop"
  ],
  "output_folder": "C:/Users/username/Organized",
  "exclude_patterns": ["*.exe", ".git", "node_modules"],
  "mode": "preview"
}
```

**レスポンス（JSON）**
```json
{
  "plan_id": 1,
  "scanned_files": 234,
  "actions": [
    {
      "action_id": 1,
      "action_type": "move",
      "source_path": "C:/Users/username/Downloads/契約書_ABC社_20240401.pdf",
      "dest_path": "C:/Users/username/Organized/Documents/2024/契約書/契約書_ABC社_20240401.pdf",
      "reason": "契約書と判定。2024年のドキュメントフォルダに分類。",
      "confidence": 0.92
    },
    {
      "action_id": 2,
      "action_type": "rename",
      "source_path": "C:/Users/username/Desktop/スクリーンショット 2024-04-01 103045.png",
      "dest_path": "C:/Users/username/Desktop/スクリーンショット 2024-04-01 103045.png",
      "new_name": "2024-04-01_会議画面キャプチャ.png",
      "reason": "スクリーンショットの内容から会議画面と推定。日付付きの意味のある名前に変更。",
      "confidence": 0.78
    },
    {
      "action_id": 3,
      "action_type": "archive",
      "source_path": "C:/Users/username/Downloads/old_report_2022.xlsx",
      "dest_path": "C:/Users/username/Organized/Archive/2022以前/old_report_2022.xlsx",
      "reason": "2年以上アクセスなし。アーカイブフォルダへ移動を推奨。",
      "confidence": 0.95
    }
  ],
  "summary": {
    "total_actions": 89,
    "moves": 45,
    "renames": 23,
    "archives": 18,
    "skips": 3,
    "duplicates_found": 7,
    "estimated_freed_space_mb": 0
  }
}
```

### POST /execute
整理プランを実行する。

**リクエスト（JSON）**
```json
{
  "plan_id": 1,
  "approved_action_ids": [1, 2, 3, 5, 8],
  "approval_mode": "selective"
}
```

**レスポンス（JSON）**
```json
{
  "execution_id": 1,
  "plan_id": 1,
  "executed_actions": 5,
  "failed_actions": 0,
  "execution_log": [
    {
      "action_id": 1,
      "status": "success",
      "executed_at": "2024-04-01T10:30:00"
    }
  ],
  "rollback_available": true
}
```

### POST /rollback/{execution_id}
直前の整理操作を元に戻す。

### GET /executions
実行履歴一覧を取得する。

### GET /executions/{execution_id}/report
整理結果レポートを取得する。

### POST /settings
監視フォルダ・スケジュール設定を保存する。

---

## データモデル

### plansテーブル
```sql
CREATE TABLE plans (
    id             SERIAL PRIMARY KEY,
    watch_folders  JSONB,
    output_folder  TEXT,
    scanned_files  INTEGER,
    actions        JSONB,
    summary        JSONB,
    created_at     TIMESTAMP DEFAULT NOW()
);
```

### executionsテーブル
```sql
CREATE TABLE executions (
    id                SERIAL PRIMARY KEY,
    plan_id           INTEGER REFERENCES plans(id),
    approved_actions  JSONB,
    executed_actions  INTEGER,
    failed_actions    INTEGER,
    execution_log     JSONB,
    rollback_data     JSONB,    -- ロールバック用の元情報
    created_at        TIMESTAMP DEFAULT NOW()
);
```

### execution_itemsテーブル
```sql
CREATE TABLE execution_items (
    id            SERIAL PRIMARY KEY,
    execution_id  INTEGER REFERENCES executions(id),
    action_type   VARCHAR(20) NOT NULL,
    source_path   TEXT NOT NULL,
    target_path   TEXT,
    status        VARCHAR(20) NOT NULL,   -- success / failed / skipped / conflict / locked
    error_code    VARCHAR(50),
    rollbackable  BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT NOW()
);
```

### settingsテーブル
```sql
CREATE TABLE settings (
    id               SERIAL PRIMARY KEY,
    watch_folders    JSONB,
    output_folder    TEXT,
    exclude_patterns JSONB,
    mode             VARCHAR(20),
    schedule         VARCHAR(50),
    updated_at       TIMESTAMP DEFAULT NOW()
);
```

---

## プロンプト仕様

### 整理方針決定プロンプト
```
あなたはファイル整理の専門家AIです。
以下のファイル情報をもとに、最適な整理方針を決定してください。

整理先フォルダ構成：
{output_folder_structure}

ファイル情報：
{file_info_list}

ルール：
1. ファイルの内容・用途に応じて適切なフォルダに分類すること
2. ファイル名が意味不明な場合は内容を反映した名前に変更すること
3. 2年以上アクセスのないファイルはアーカイブを推奨すること
4. 実行ファイル（.exe・.bat等）は移動しないこと
5. 確信が持てない場合はconfidenceを低くしてスキップを推奨すること
6. 必ず指定のJSONフォーマットで返すこと
```

---

## ガードレール設計

- 実行ファイル（.exe・.bat・.msi等）は操作対象外
- システムフォルダ（C:\Windows・C:\Program Files等）は操作対象外
- ファイルの完全削除は行わない（ゴミ箱への移動のみ提案）
- 実行前に必ずプレビューを生成してユーザー承認を得る
- すべての操作をロールバックデータとともにログに記録
- confidenceが0.7未満のアクションはデフォルトでスキップ
- JSON形式が壊れていた場合：最大3回まで再試行

---

## 技術スタック

| 用途 | 技術 |
|------|------|
| APIサーバー | FastAPI |
| ファイルシステムアクセス | MCP filesystem サーバー |
| エージェントフレームワーク | LangGraph |
| LLM | Qwen3-27B（Q4量子化）/ LM Studio経由（完全ローカル） |
| テキスト抽出 | PyMuPDF / python-docx |
| 出力バリデーション | Pydantic |
| DB | PostgreSQL |
| ORM | SQLAlchemy |
| 定期実行 | APScheduler |
| トレース・ログ | MLflow |

---

## 対応する知識マップ項目

| 工程 | 習得できる知識マップ項目 |
|------|----------------------|
| 工程1：要件定義 | AIの役割範囲・**Human-in-the-loop要件**・ガードレール要件 |
| 工程2：基本設計 | **MCP（filesystem）設計**・**Skills設計**・シングルエージェント設計・LangGraph |
| 工程3：詳細設計 | **エージェントループ詳細設計**・**停止条件**・**Human-in-the-loop割り込みポイント定義**・状態管理 |
| 工程4：実装 | **MCP filesystem実装**・**エージェントループ実装（LangGraph）**・定期実行（APScheduler）・ロールバック実装・MLflowトレース |
| 工程5：検証 | ガードレール検証（実行ファイル除外・完全削除禁止・システムフォルダ除外） |
| 横断 | FastAPI・PostgreSQL・SQLAlchemy・Python |

---

## 対象外（スコープ外）

- 画面UI（フロントエンド）
- クラウドストレージ（OneDrive・Google Drive等）の整理
- ファイルの完全削除
- 画像・動画の内容解析（ファイル名・メタ情報のみで判断）
- ネットワークドライブの整理（ローカルフォルダのみ）
