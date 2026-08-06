const http = require("http");
const { validateWebhook } = require("./webhook");
const seen = new Set();
const MAX_BODY_BYTES = 64 * 1024;

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    return send(res, 404, { error: "not_found" });
  }

  const chunks = [];
  let bodyBytes = 0;
  req.on("data", (chunk) => {
    bodyBytes += chunk.length;
    if (bodyBytes <= MAX_BODY_BYTES) chunks.push(chunk);
  });
  req.on("end", () => {
    if (bodyBytes > MAX_BODY_BYTES) return send(res, 413, { error: "body_too_large" });

    const result = validateWebhook({
      timestamp: req.headers["x-timestamp"],
      body: Buffer.concat(chunks),
      signature: req.headers["x-signature"],
      eventId: req.headers["x-event-id"],
    }, { seen });
    send(res, result.status, result);
  });
}).listen(4111, () => console.log("security11 listening on http://localhost:4111"));
