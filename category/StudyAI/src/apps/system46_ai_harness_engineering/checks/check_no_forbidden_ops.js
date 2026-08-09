const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node check_no_forbidden_ops.js <fixture>");
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8").toLowerCase();
const forbidden = ["delete_arbitrary_path", "external_send", "secret", "password"];
const found = forbidden.filter((word) => text.includes(word));

if (found.length > 0) {
  console.error(`forbidden operation found: ${found.join(", ")}`);
  process.exit(1);
}

console.log("forbidden operation check ok");

