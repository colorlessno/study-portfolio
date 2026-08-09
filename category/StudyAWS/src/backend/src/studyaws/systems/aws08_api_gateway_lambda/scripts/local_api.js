const http = require("http");
const { handler } = require("../src/handler");
const port = Number(process.env.PORT || 4108);

http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", async () => {
    const result = await handler({
      rawPath: new URL(req.url, `http://localhost:${port}`).pathname,
      body,
      requestContext: { http: { method: req.method } },
    });
    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
  });
}).listen(port, () => console.log(`local api listening on http://localhost:${port}`));
