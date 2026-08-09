const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node check_output_schema.js <markdown>");
  process.exit(1);
}

const text = fs.readFileSync(file, "utf8");
const required = ["## 要約", "## 残リスク"];
const missing = required.filter((section) => !text.includes(section));

if (missing.length > 0) {
  console.error(`missing sections: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("output schema ok");
