const http = require("http");
const crypto = require("crypto");

const secret = "example-jwt-secret";

function b64url(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(data) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

function issueToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({ sub: "u-demo", role: "operator", iat: now, exp: now + 600 }));
  const body = `${header}.${payload}`;
  return `${body}.${sign(body)}`;
}

function verify(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("format");
  const body = `${parts[0]}.${parts[1]}`;
  if (!crypto.timingSafeEqual(Buffer.from(sign(body)), Buffer.from(parts[2]))) throw new Error("signature");
  const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  if (claims.exp < Math.floor(Date.now() / 1000)) throw new Error("expired");
  return claims;
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/token") return send(res, 200, { token: issueToken() });
  if (req.method === "GET" && req.url === "/profile") {
    try {
      const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      return send(res, 200, { claims: verify(token) });
    } catch (error) {
      return send(res, 401, { error: error.message });
    }
  }
  send(res, 404, { error: "not_found" });
}).listen(4102, () => console.log("security02 listening on http://localhost:4102"));
