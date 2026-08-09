function judgePrompt(text) {
  const input = String(text || "");
  const lower = input.toLowerCase();
  if (lower.includes("ignore previous") || input.includes("上書き")) return { decision: "review", reason: "instruction_override_pattern" };
  if (lower.includes("secret") || input.includes("秘密")) return { decision: "reject", reason: "secret_request" };
  return { decision: "answer", reason: "normal" };
}

if (typeof document !== "undefined") {
  document.getElementById("judge").addEventListener("click", () => {
    document.getElementById("result").textContent = JSON.stringify(judgePrompt(document.getElementById("prompt").value), null, 2);
  });
}

if (typeof module !== "undefined") module.exports = { judgePrompt };
