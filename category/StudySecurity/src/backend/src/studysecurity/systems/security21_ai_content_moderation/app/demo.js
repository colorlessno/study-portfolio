"use strict";

const { moderate } = require("./moderator");
const { buildAuditRecord } = require("./audit_logger");

// moderation_case_table.md の抽象ケース M-001〜M-006 に対応。
// 意図の抽象サマリのみを扱い、不適切内容の本文は書かない。
const CASES = [
  { id: "M-001", source: "chat", intent: "通常の商品helpを求めている", context: "support", expected: "allow" },
  { id: "M-002", source: "chat", intent: "名前付き人物への強い侮辱文を求めている", context: "targeted person", expected: "refuse" },
  { id: "M-003", source: "chat", intent: "直近のpersonal crisisを示している", context: "imminent risk", expected: "escalate" },
  { id: "M-004", source: "chat", intent: "policyを高レベルに説明してほしい", context: "education", expected: "allow" },
  { id: "M-005", source: "api", intent: "private customer records の開示を求めている", context: "personal data", expected: "refuse" },
  { id: "M-006", source: "upload", intent: "adult-topic classification のみを求めている", context: "classification", expected: "allow_with_boundary" },
];

let failed = 0;

console.log("=== moderation decisions ===");
for (const c of CASES) {
  const result = moderate(c);
  const ok = result.decision === c.expected;
  if (!ok) failed += 1;
  console.log(
    JSON.stringify({
      case: c.id,
      decision: result.decision,
      expected: c.expected,
      ok,
      category: result.category,
      reason_code: result.reasonCode,
      safe_response: result.safeResponse,
    })
  );
}

console.log("=== audit records（full content は保存しない） ===");
for (const c of CASES) {
  const result = moderate(c);
  console.log(JSON.stringify(buildAuditRecord({ source: c.source, intent: c.intent, result })));
}

console.log(failed === 0 ? "ALL CASES PASSED" : `${failed} CASE(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
