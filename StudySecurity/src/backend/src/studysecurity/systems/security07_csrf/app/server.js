const http = require("http");
const crypto = require("crypto");
const tokens = new Set();
let balance = 1000;

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Set-Cookie": "sid=demo; HttpOnly; SameSite=Lax; Path=/" });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/form") {
    const token = crypto.randomBytes(12).toString("hex");
    tokens.add(token);
    return send(res, 200, `<form method="post" action="/transfer"><input name="csrf" value="${token}"><button>send</button></form>`, "text/html; charset=utf-8");
  }
  if (req.method === "POST" && req.url === "/transfer") {
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      const token = new URLSearchParams(body).get("csrf");
      if (!token || !tokens.delete(token)) return send(res, 403, { error: "invalid_csrf" });
      balance -= 1;
      send(res, 200, { balance });
    });
    return;
  }
  send(res, 404, { error: "not_found" });
}).listen(4107, () => console.log("security07 listening on http://localhost:4107"));
