const http = require("http");
const { verify } = require("./signature");
const seen = new Set();

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") return send(res, 404, { error: "not_found" });
  let body = "";
  req.on("data", (c) => { body += c; });
  req.on("end", () => {
    const timestamp = req.headers["x-timestamp"];
    const signature = req.headers["x-signature"];
    const eventId = req.headers["x-event-id"];
    if (Math.abs(Date.now() - Number(timestamp)) > 300000) return send(res, 401, { error: "timestamp" });
    if (!verify(timestamp, body, signature)) return send(res, 401, { error: "signature" });
    if (seen.has(eventId)) return send(res, 409, { error: "replay" });
    seen.add(eventId);
    send(res, 200, { ok: true });
  });
}).listen(4111, () => console.log("security11 listening on http://localhost:4111"));
