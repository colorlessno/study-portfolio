const fs = require("fs");
const path = require("path");
const severityOrder = { critical: 4, high: 3, moderate: 2, low: 1, info: 0 };

function buildRemediationPlan(report) {
  if (!report || !Array.isArray(report.vulnerabilities)) {
    throw new TypeError("vulnerabilities must be an array");
  }

  const actions = report.vulnerabilities.map((vulnerability) => {
    const severity = String(vulnerability.severity || "unknown").toLowerCase();
    return {
      package: vulnerability.package,
      severity,
      action: vulnerability.fixAvailable ? "update" : "review",
      note: vulnerability.note,
    };
  }).sort((a, b) => (severityOrder[b.severity] ?? -1) - (severityOrder[a.severity] ?? -1));

  const summary = actions.reduce((counts, item) => {
    counts[item.severity] = (counts[item.severity] || 0) + 1;
    return counts;
  }, {});
  return { summary, actions };
}

if (require.main === module) {
  const report = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "samples", "npm_audit_sample.json"), "utf8"));
  console.log(JSON.stringify(buildRemediationPlan(report), null, 2));
}

module.exports = { buildRemediationPlan };
