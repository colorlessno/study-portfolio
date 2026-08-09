const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node checks/readonly_sql_check.js <sql-file>");
  process.exit(2);
}

const sql = fs.readFileSync(path.resolve(filePath), "utf8");
const withoutComments = sql
  .replace(/--.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .toLowerCase();

const forbidden = [
  "insert",
  "update",
  "delete",
  "merge",
  "drop",
  "alter",
  "create",
  "truncate",
  "grant",
  "revoke",
  "copy",
  "\\copy"
];

const hits = forbidden.filter((word) => new RegExp(`\\b${word.replace("\\", "\\\\")}\\b`, "i").test(withoutComments));

if (hits.length > 0) {
  console.error(`Not read-only: ${hits.join(", ")}`);
  process.exit(1);
}

console.log(`Read-only SQL check passed: ${filePath}`);
