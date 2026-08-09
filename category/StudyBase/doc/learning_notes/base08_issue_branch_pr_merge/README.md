# base08 Issue → branch → push → PR → merge → sync

Issueの目的からbranch、差分、検証、review対応、merge、ローカルmain同期までを結びます。短い文書演習の後、Giteaを社内Gitサーバーに見立てて実操作できます。実GitHubは変更しません。

## 到達目標

- Issueの完了条件をPRの変更と検証へ対応付けられる。
- PRへ「何を変えたか」「なぜ」「どう確認したか」を書ける。
- review指摘へ原因、対処、横展開、再確認で回答できる。
- mainへの直接pushを避け、review担当の承認後にmergeできる。
- server側でmergeされたmainをローカルへ安全に同期できる。

## 教材

- [Issue例](../../../src/samples/base08_issue_branch_pr_merge/sample_issue.md) / [PR例](../../../src/samples/base08_issue_branch_pr_merge/sample_pull_request.md) / [review回答例](../../../src/samples/base08_issue_branch_pr_merge/sample_review_response.md)
- [Giteaによるチーム開発演習](../../../src/samples/base08_issue_branch_pr_merge/gitea_lab/README.md)
- [テンプレート](../../templates/base08_issue_branch_pr_merge/)
- [要件定義](../../requirements/base08_issue_branch_pr_merge_requirements.md) / [基本設計](../../basic_design/base08_basic_design.md) / [詳細設計](../../detailed_design/base08_detailed_design.md)

## 15分で再開

```powershell
node category/StudyBase\scripts\validate-studybase.mjs base08
```

Issue例の完了条件とPR例の変更・確認結果を線で対応させ、不足している証拠を1つ書きます。review回答では修正内容だけでなく原因と再確認を確認します。

## 実務に近い演習へ進む

[Giteaによるチーム開発演習](../../../src/samples/base08_issue_branch_pr_merge/gitea_lab/README.md)で、次の一連を実際に操作します。

```text
Issue → local branch → commit/test → push → PR → review修正
      → 承認 → server側mainへmerge → local mainをpullで同期
```

企業ごとにGitHub Flow、Git Flow、trunk-based developmentなど採用ルールは異なります。この演習では、小さな変更を短命branchとPRでmainへ統合する一般的な基本形を扱います。

## 完了条件

Issueから同期までの各段階で、目的、差分、検証、判断者を説明でき、ローカルmainとremote mainが同じcommitになれば完了です。実GitHubでのPR作成は公開対象と権限を確認した別工程で行います。
