const fs = require("fs");
const path = require("path");
const report = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "samples", "npm_audit_sample.json"), "utf8"));

const rows = report.vulnerabilities.map((v) => ({
  package: v.package,
  severity: v.severity,
  action: v.fixAvailable ? "update" : "review",
  note: v.note,
}));

console.log(JSON.stringify(rows, null, 2));
