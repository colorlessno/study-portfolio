const http = require("http");
const crypto = require("crypto");
const tokens = new Map();
let balance = 1000;

function parseCookies(header = "") {
  return Object.fromEntries(header.split(";").filter(Boolean).map((part) => {
    const [key, ...rest] = part.trim().split("=");
    return [key, decodeURIComponent(rest.join("="))];
  }));
}

function send(res, status, body, type = "application/json; charset=utf-8", headers = {}) {
  res.writeHead(status, { "Content-Type": type, ...headers });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}

http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(302, { Location: "/form" });
    return res.end();
  }
  if (req.method === "GET" && req.url === "/form") {
    const token = crypto.randomBytes(12).toString("hex");
    tokens.set(token, Date.now() + 5 * 60 * 1000);
    return send(
      res,
      200,
      `<form method="post" action="/transfer"><input name="csrf" value="${token}"><button>send</button></form>`,
      "text/html; charset=utf-8",
      { "Set-Cookie": "sid=demo; HttpOnly; SameSite=Lax; Path=/" },
    );
  }
  if (req.method === "POST" && req.url === "/transfer") {
    if (parseCookies(req.headers.cookie).sid !== "demo") return send(res, 401, { error: "login_required" });
    let body = "";
    req.on("data", (c) => { body += c; });
    req.on("end", () => {
      const token = new URLSearchParams(body).get("csrf");
      const expiresAt = token ? tokens.get(token) : undefined;
      if (token) tokens.delete(token);
      if (!expiresAt || expiresAt < Date.now()) return send(res, 403, { error: "invalid_csrf" });
      balance -= 1;
      send(res, 200, { balance });
    });
    return;
  }
  send(res, 404, { error: "not_found" });
}).listen(4107, () => console.log("security07 listening on http://localhost:4107"));
