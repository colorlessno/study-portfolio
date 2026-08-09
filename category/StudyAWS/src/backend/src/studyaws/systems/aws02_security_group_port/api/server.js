const http = require("http");
const port = Number(process.env.API_PORT || 5102);

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ service: "api", internalOnly: true }));
}).listen(port, () => console.log(`api internal endpoint :${port}`));
