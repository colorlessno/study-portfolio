const http = require("http");
const { createLimiter } = require("./rate_limiter");
const limit = createLimiter(3, 10000);

http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200); return res.end("ok");
  }
  const result = limit(req.headers["x-user"] || req.socket.remoteAddress);
  if (!result.allowed) {
    res.writeHead(429, { "Retry-After": String(result.retryAfter), "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "rate_limited" }));
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}).listen(4113, () => console.log("security13 listening on http://localhost:4113"));
