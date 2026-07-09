const periods = { order: 365, inquiry: 180, audit: 1095 };

function deletionCandidates(records, today = new Date("2026-04-29")) {
  return records.map((r) => {
    const ageDays = Math.floor((today - new Date(r.updatedAt)) / 86400000);
    const expired = ageDays > periods[r.type];
    return { id: r.id, type: r.type, delete: expired && !r.legalHold, reason: r.legalHold ? "legal_hold" : expired ? "retention_expired" : "within_retention" };
  });
}

module.exports = { deletionCandidates };
