const http = require("http");
const port = Number(process.env.PORT || 4109);
const appName = process.env.APP_NAME || "studyaws-simple-deploy";

http.createServer((req, res) => {
  console.log(JSON.stringify({ at: new Date().toISOString(), path: req.url }));
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, appName }));
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ appName, message: "ready" }));
}).listen(port, () => console.log(`${appName} listening on ${port}`));
