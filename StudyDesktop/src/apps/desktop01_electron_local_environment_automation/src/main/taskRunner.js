const { spawn } = require("child_process");
const { randomUUID } = require("crypto");
const { getTask } = require("./commandAllowlist");
const { cleanupRun } = require("./cleanup");

const running = new Map();

function createEvent(runId, type, message, level = "info") {
  return {
    runId,
    type,
    level,
    message,
    timestamp: new Date().toISOString()
  };
}

function startTask(taskId, onEvent) {
  const task = getTask(taskId);
  if (!task) {
    throw new Error(`Task is not allowlisted: ${taskId}`);
  }

  const runId = randomUUID();
  onEvent(createEvent(runId, "queued", `Queued ${taskId}`));

  const child = spawn(task.command, task.args, {
    cwd: process.cwd(),
    shell: false,
    env: { ...process.env, DESKTOP01_RUN_ID: runId }
  });

  running.set(runId, child);
  onEvent(createEvent(runId, "running", `Started ${taskId}`));

  child.stdout.on("data", (chunk) => onEvent(createEvent(runId, "stdout", chunk.toString().trim())));
  child.stderr.on("data", (chunk) => onEvent(createEvent(runId, "stderr", chunk.toString().trim(), "warn")));
  child.on("close", (code) => {
    running.delete(runId);
    const status = code === 0 ? "completed" : "failed";
    onEvent(createEvent(runId, status, `${taskId} exited with ${code}`, code === 0 ? "info" : "error"));
  });

  return { runId };
}

function cancelTask(runId, onEvent) {
  const child = running.get(runId);
  if (!child) {
    return { cancelled: false, reason: "not running" };
  }
  onEvent(createEvent(runId, "cancelling", "Cancellation requested"));
  child.kill();
  const cleanupSummary = cleanupRun(runId);
  onEvent(createEvent(runId, "cancelled", JSON.stringify(cleanupSummary)));
  return { cancelled: true, cleanupSummary };
}

module.exports = { startTask, cancelTask };

