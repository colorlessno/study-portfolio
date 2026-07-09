const http = require("http");
const allowed = new Set(["http://localhost:3000", "http://localhost:5173"]);

function corsHeaders(origin) {
  if (!allowed.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Vary": "Origin",
  };
}

http.createServer((req, res) => {
  const headers = corsHeaders(req.headers.origin);
  if (req.method === "OPTIONS") {
    res.writeHead(Object.keys(headers).length ? 204 : 403, headers);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify({ ok: true }));
}).listen(4114, () => console.log("security14 listening on http://localhost:4114"));
