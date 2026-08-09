const fs = require("fs");
const path = require("path");

const samplesDir = process.argv[2];

if (!samplesDir) {
  console.error("Usage: node checks/check_role_outputs.js <samples-dir>");
  process.exit(2);
}

const requiredSections = {
  "plan.md": ["## 目的", "## 対象外", "## 作業順序", "## 不足情報"],
  "design_note.md": ["## 構成", "## データ", "## 境界", "## 失敗時の扱い"],
  "execution_proposal.md": ["## 実行案", "## 変更対象", "## 実行しない操作", "## 承認待ち"],
  "review_report.md": ["## 指摘事項", "## 重大度", "## 対応案", "## 残リスク"],
  "qa_checklist.md": ["## 確認観点", "## 機械的検査", "## 受入条件"],
  "safety_report.md": ["## 禁止操作", "## 承認待ち操作", "## 秘密情報確認"],
  "decision_log.md": ["## 判断", "## 理由", "## 参照成果物", "## 次回引き継ぎ"],
  "final_report.md": ["## 結論", "## 作成物", "## 残課題", "## 次の作業"]
};

const unresolvedMarkers = ["TODO", "TBD", "未定", "あとで"];

for (const [fileName, sections] of Object.entries(requiredSections)) {
  const filePath = path.resolve(samplesDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`missing output: ${fileName}`);
    process.exit(1);
  }

  const text = fs.readFileSync(filePath, "utf8");
  const missing = sections.filter((section) => !text.includes(section));
  if (missing.length > 0) {
    console.error(`${fileName} missing sections: ${missing.join(", ")}`);
    process.exit(1);
  }

  const hasUnresolved = unresolvedMarkers.some((marker) => text.includes(marker));
  if (hasUnresolved) {
    console.error(`${fileName} contains unresolved marker`);
    process.exit(1);
  }

  for (const section of sections) {
    const index = text.indexOf(section);
    const next = sections
      .map((candidate) => text.indexOf(candidate, index + section.length))
      .filter((candidateIndex) => candidateIndex > index)
      .sort((a, b) => a - b)[0];
    const body = text.slice(index + section.length, next || text.length).trim();
    if (body.length === 0) {
      console.error(`${fileName} has empty section: ${section}`);
      process.exit(1);
    }
  }
}

console.log(`role outputs check passed: ${samplesDir}`);
