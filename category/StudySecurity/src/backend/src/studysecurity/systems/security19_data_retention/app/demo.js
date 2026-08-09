const assert = require("assert");
const { deletionCandidates } = require("./retention_policy");

const records = [
  { id: "o-1", type: "order", updatedAt: "2024-01-01", legalHold: false },
  { id: "i-1", type: "inquiry", updatedAt: "2026-01-01", legalHold: false },
  { id: "a-1", type: "audit", updatedAt: "2020-01-01", legalHold: true },
  { id: "o-boundary", type: "order", updatedAt: "2025-04-29", legalHold: false },
  { id: "x-1", type: "unknown", updatedAt: "2020-01-01", legalHold: false },
];

const results = deletionCandidates(records);
assert.deepStrictEqual(results.map((result) => result.reason), [
  "retention_expired",
  "within_retention",
  "legal_hold",
  "retention_expired",
  "unknown_type",
]);
assert.strictEqual(results[3].ageDays, 365);
console.log(JSON.stringify(results, null, 2));
