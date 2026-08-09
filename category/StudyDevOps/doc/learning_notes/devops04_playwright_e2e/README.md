# devops04 Playwright E2E

目安: 初回30〜50分。ブラウザで画面を操作し、入力から結果表示までを利用者の視点で確認します。初回だけChromiumの取得に時間がかかる場合があります。

## このテーマでできるようになること

- E2E testがunit/API testより広い範囲を確認する理由を説明する。
- locator、操作、期待結果を1つの利用シナリオとして読む。
- 失敗時のtraceとscreenshotを調査用artifactとして扱う。

## 成果物

- [要件定義](../../requirements/devops04_playwright_e2e_requirements.md)
- [基本設計](../../basic_design/devops04_basic_design.md)
- [詳細設計](../../detailed_design/devops04_detailed_design.md)
- [画面server](../../../src/apps/devops04_playwright_e2e/app/src/server.js)
- [E2E test](../../../src/apps/devops04_playwright_e2e/tests/e2e/form.spec.ts)
- [Playwright設定](../../../src/apps/devops04_playwright_e2e/playwright.config.ts)

## 始める前に予想する

1. button click後の文言だけでなく、空入力も確認する理由は何か。
2. CSS classより`data-testid`をlocatorに使うと、どんな変更へ強くなるか。

## 15分で再開する

```powershell
npm.cmd --prefix category/StudyDevOps/src/apps/devops04_playwright_e2e ci
npm.cmd --prefix category/StudyDevOps/src/apps/devops04_playwright_e2e exec -- playwright install chromium
npm.cmd --prefix category/StudyDevOps/src/apps/devops04_playwright_e2e run test:e2e
```

期待結果は2件のbrowser test成功です。`playwright.config.ts`の`webServer`が画面serverを自動起動するため、別terminalでserverを起動する必要はありません。

## 読む順番と観察点

1. E2E testのtest名だけを読み、利用者の操作を予想する。
2. 画面serverのHTMLで`data-testid`とvalidation処理を探す。
3. testのlocator、操作、assertionを画面実装へ対応付ける。
4. Playwright設定で失敗時だけ証跡を残す設定を確認する。

## 安全に壊して直す

作業ブランチでtestの期待文言を一時的に変更し、失敗時に`test-results`が作られることを確認します。元へ戻し、再実行後に成功させます。生成物はGitへ登録しません。

## 説明してみる

- APIが200を返すだけでは画面の利用成功を証明できないのはなぜか。
- traceやscreenshotにsecretを表示してはいけないのはなぜか。

## 制約と完了条件

外部APIや実ユーザー情報は使いません。CIでは失敗時のみartifactをアップロードします。

- [ ] 2件のE2E testが成功した。
- [ ] E2E testで追加確認できる範囲を説明した。
- [ ] 失敗証跡の場所を確認し、復旧後の成功を確認した。
