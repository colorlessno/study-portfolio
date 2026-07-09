const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node checks/check_task_board.js <task_board.json>");
  process.exit(2);
}

const board = JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
const required = [
  "task_id",
  "title",
  "status",
  "current_role",
  "mode",
  "round",
  "max_rounds",
  "required_outputs",
  "approval_required",
  "completed_roles"
];

const missing = required.filter((field) => !(field in board));
if (missing.length > 0) {
  console.error(`missing fields: ${missing.join(", ")}`);
  process.exit(1);
}

const allowedStatuses = new Set(["new", "in_progress", "in_review", "blocked", "completed"]);
if (!allowedStatuses.has(board.status)) {
  console.error(`invalid status: ${board.status}`);
  process.exit(1);
}

const allowedModes = new Set(["mock", "local_llm"]);
if (!allowedModes.has(board.mode)) {
  console.error(`invalid mode: ${board.mode}`);
  process.exit(1);
}

if (!Number.isInteger(board.round) || !Number.isInteger(board.max_rounds) || board.round > board.max_rounds) {
  console.error("invalid round/max_rounds");
  process.exit(1);
}

if (!Array.isArray(board.required_outputs) || board.required_outputs.length === 0) {
  console.error("required_outputs must be a non-empty array");
  process.exit(1);
}

if (!Array.isArray(board.approval_required)) {
  console.error("approval_required must be an array");
  process.exit(1);
}

if (!Array.isArray(board.completed_roles)) {
  console.error("completed_roles must be an array");
  process.exit(1);
}

console.log(`task board check passed: ${filePath}`);
