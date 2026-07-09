const { deletionCandidates } = require("./retention_policy");

const records = [
  { id: "o-1", type: "order", updatedAt: "2024-01-01", legalHold: false },
  { id: "i-1", type: "inquiry", updatedAt: "2026-01-01", legalHold: false },
  { id: "a-1", type: "audit", updatedAt: "2020-01-01", legalHold: true },
];

console.log(JSON.stringify(deletionCandidates(records), null, 2));
