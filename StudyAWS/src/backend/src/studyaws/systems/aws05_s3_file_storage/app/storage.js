const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "storage", "study-bucket");

function objectPath(key) {
  if (key.includes("..") || path.isAbsolute(key)) throw new Error("invalid_object_key");
  return path.join(root, key);
}

function upload(key, source) {
  const target = objectPath(key);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return { key, bytes: fs.statSync(target).size };
}

function list() {
  if (!fs.existsSync(root)) return [];
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else results.push(path.relative(root, full).replaceAll("\\", "/"));
    }
  }
  walk(root);
  return results;
}

const sample = path.join(__dirname, "..", "samples", "sample.txt");
console.log("upload", upload("docs/sample.txt", sample));
console.log("list", list());
console.log("get", fs.readFileSync(objectPath("docs/sample.txt"), "utf8").trim());
try { objectPath("../secret.txt"); } catch (error) { console.log("blocked", error.message); }
