const allowed = new Set([".csv", ".txt", ".pdf"]);
const maxBytes = 1024 * 1024;

document.getElementById("check").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const size = Number(document.getElementById("size").value);
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : "";
  const errors = [];
  if (!allowed.has(ext)) errors.push("extension_not_allowed");
  if (!Number.isFinite(size) || size < 0) errors.push("invalid_size");
  else if (size > maxBytes) errors.push("size_exceeded");
  document.getElementById("result").textContent = JSON.stringify({ ext, accepted: errors.length === 0, errors }, null, 2);
});
