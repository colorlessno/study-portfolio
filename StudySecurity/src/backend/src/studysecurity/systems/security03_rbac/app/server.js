const http = require("http");

const permissions = {
  "orders:read": ["admin", "operator", "viewer"],
  "orders:cancel": ["admin", "operator"],
};

function authorize(role, action) {
  return permissions[action]?.includes(role);
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const role = req.headers["x-role"];
  if (!role) return send(res, 401, { error: "unauthenticated" });
  if (req.method === "GET" && req.url === "/orders") {
    return authorize(role, "orders:read") ? send(res, 200, { orders: [{ id: "o-100", status: "open" }] }) : send(res, 403, { error: "forbidden" });
  }
  if (req.method === "POST" && req.url === "/orders/o-100/cancel") {
    return authorize(role, "orders:cancel") ? send(res, 200, { id: "o-100", status: "canceled" }) : send(res, 403, { error: "forbidden" });
  }
  send(res, 404, { error: "not_found" });
}).listen(4103, () => console.log("security03 listening on http://localhost:4103"));
