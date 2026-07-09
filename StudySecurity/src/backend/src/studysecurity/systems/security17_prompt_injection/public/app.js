function judgePrompt(text) {
  const lower = text.toLowerCase();
  if (lower.includes("ignore previous") || text.includes("上書き")) return { decision: "review", reason: "instruction_override_pattern" };
  if (lower.includes("secret") || text.includes("秘密")) return { decision: "reject", reason: "secret_request" };
  return { decision: "answer", reason: "normal" };
}

document.getElementById("judge").addEventListener("click", () => {
  document.getElementById("result").textContent = JSON.stringify(judgePrompt(document.getElementById("prompt").value), null, 2);
});
