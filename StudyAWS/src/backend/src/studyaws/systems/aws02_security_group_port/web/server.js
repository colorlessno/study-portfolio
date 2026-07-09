const http = require("http");
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ service: "web", publicPort: 4102, talksTo: "api:5102" }));
}).listen(4102, () => console.log("web public endpoint http://localhost:4102"));
