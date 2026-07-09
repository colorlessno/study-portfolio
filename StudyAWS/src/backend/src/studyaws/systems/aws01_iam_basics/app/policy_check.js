const fs = require("fs");
const path = require("path");

function match(pattern, value) {
  if (pattern === "*") return true;
  if (pattern.endsWith("*")) return value.startsWith(pattern.slice(0, -1));
  return pattern === value;
}

function evaluate(policy, action, resource) {
  let allowed = false;
  for (const statement of policy.statements) {
    const actionMatch = statement.actions.some((p) => match(p, action));
    const resourceMatch = statement.resources.some((p) => match(p, resource));
    if (!actionMatch || !resourceMatch) continue;
    if (statement.effect === "Deny") return "explicitDeny";
    if (statement.effect === "Allow") allowed = true;
  }
  return allowed ? "allow" : "implicitDeny";
}

const dir = path.join(__dirname, "..", "policies");
const cases = [
  ["s3:GetObject", "arn:aws:s3:::study-bucket/orders.csv"],
  ["s3:PutObject", "arn:aws:s3:::study-bucket/orders.csv"],
  ["s3:DeleteObject", "arn:aws:s3:::study-bucket/orders.csv"],
  ["logs:FilterLogEvents", "arn:aws:logs:::study-app"],
];

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
  const policy = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  console.log(`# ${policy.name}`);
  for (const [action, resource] of cases) {
    console.log(`${action} ${resource} => ${evaluate(policy, action, resource)}`);
  }
}
