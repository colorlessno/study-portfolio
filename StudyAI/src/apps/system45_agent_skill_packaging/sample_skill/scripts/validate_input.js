const fs = require("fs");

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node validate_input.js <file>");
  process.exit(1);
}

const text = fs.readFileSync(inputPath, "utf8");
const forbidden = ["secret", "token", "password"];
const found = forbidden.filter((word) => text.toLowerCase().includes(word));

if (!text.includes("task_goal") || !text.includes("target_file") || !text.includes("expected_output")) {
  console.error("missing required sample fields");
  process.exit(1);
}

if (found.length > 0) {
  console.error(`forbidden words found: ${found.join(", ")}`);
  process.exit(1);
}

console.log("input sample looks valid");

