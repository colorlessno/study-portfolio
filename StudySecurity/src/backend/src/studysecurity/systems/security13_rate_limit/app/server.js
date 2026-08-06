const http = require("http");
const { createLimiter } = require("./rate_limiter");
const limit = createLimiter(3, 10000);

http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200); return res.end("ok");
  }
  const demoUser = String(req.headers["x-demo-user"] || "").trim();
  const key = demoUser ? `user:${demoUser}` : `ip:${req.socket.remoteAddress}`;
  const result = limit(key);
  const rateHeaders = {
    "RateLimit-Limit": "3",
    "RateLimit-Remaining": String(result.remaining),
    "Cache-Control": "no-store",
  };
  if (!result.allowed) {
    res.writeHead(429, { ...rateHeaders, "Retry-After": String(result.retryAfter), "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "rate_limited" }));
  }
  res.writeHead(200, { ...rateHeaders, "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}).listen(4113, () => console.log("security13 listening on http://localhost:4113"));
