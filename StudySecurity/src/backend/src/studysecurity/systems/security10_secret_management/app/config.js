const required = ["APP_SECRET", "WEBHOOK_SECRET"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  console.error(JSON.stringify({ error: "missing_environment", names: missing }));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ loaded: required, values: "masked" }));
}
