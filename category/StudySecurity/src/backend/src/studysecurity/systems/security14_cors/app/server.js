const http = require("http");
const allowed = new Set(["http://localhost:3000", "http://localhost:5173"]);

function corsHeaders(origin) {
  const varyingHeaders = { "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers" };
  if (!allowed.has(origin)) return varyingHeaders;
  return {
    ...varyingHeaders,
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
}

http.createServer((req, res) => {
  const headers = corsHeaders(req.headers.origin);
  if (req.method === "OPTIONS") {
    res.writeHead(allowed.has(req.headers.origin) ? 204 : 403, headers);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": "application/json", ...headers });
  res.end(JSON.stringify({ ok: true }));
}).listen(4114, () => console.log("security14 listening on http://localhost:4114"));
