const http = require("http");

const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'; object-src 'none'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
  "Cache-Control": "no-store",
};

http.createServer((req, res) => {
  res.writeHead(200, headers);
  res.end("<!doctype html><meta charset='utf-8'><h1>security15</h1>");
}).listen(4115, () => console.log("security15 listening on http://localhost:4115"));
