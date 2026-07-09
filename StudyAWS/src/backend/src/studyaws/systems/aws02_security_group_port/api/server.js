const http = require("http");
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ service: "api", internalOnly: true }));
}).listen(5102, () => console.log("api internal endpoint :5102"));
