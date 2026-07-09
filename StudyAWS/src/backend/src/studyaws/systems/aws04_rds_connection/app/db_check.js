const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"];
const config = Object.fromEntries(required.map((key) => [key, process.env[key] || null]));
const missing = required.filter((key) => !config[key]);
console.log(JSON.stringify({
  missing,
  connection: {
    host: config.DB_HOST || "not-set",
    port: config.DB_PORT || "not-set",
    database: config.DB_NAME || "not-set",
    user: config.DB_USER || "not-set",
    password: config.DB_PASSWORD ? "masked" : "not-set",
  },
}, null, 2));
if (missing.length) process.exitCode = 1;
