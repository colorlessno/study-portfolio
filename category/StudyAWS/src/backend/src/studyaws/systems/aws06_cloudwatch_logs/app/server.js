const http = require("http");
const crypto = require("crypto");
const port = Number(process.env.PORT || 4106);

function log(level, requestId, message, extra = {}) {
  console.log(JSON.stringify({ at: new Date().toISOString(), level, requestId, message, ...extra }));
}

http.createServer((req, res) => {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  if (req.url === "/error") {
    log("error", requestId, "simulated error", { path: req.url });
    res.writeHead(500, { "Content-Type": "application/json", "x-request-id": requestId });
    return res.end(JSON.stringify({ error: "simulated", requestId }));
  }
  log("info", requestId, "request ok", { path: req.url });
  res.writeHead(200, { "Content-Type": "application/json", "x-request-id": requestId });
  res.end(JSON.stringify({ ok: true, requestId }));
}).listen(port, () => console.log(`aws06 logs server listening on ${port}`));
