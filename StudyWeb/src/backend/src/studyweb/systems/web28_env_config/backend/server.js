const http = require("node:http");

const requiredEnv = ["PORT", "DATABASE_URL", "APP_MESSAGE"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env: ${missing.join(", ")}`);
  process.exit(1);
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  console.error("Invalid PORT. PORT must be a positive number.");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (req.method === "GET" && req.url === "/config-check") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        status: "ok",
        apiPort: port,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        message: process.env.APP_MESSAGE,
      }),
    );
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(port, () => {
  console.log(`web28 backend listening on ${port}`);
});
