const http = require("http");

const permissions = {
  "orders:read": ["admin", "operator", "viewer"],
  "orders:cancel": ["admin", "operator"],
};

const users = {
  "a-admin": { id: "a-admin", role: "admin" },
  "o-operator": { id: "o-operator", role: "operator" },
  "v-viewer": { id: "v-viewer", role: "viewer" },
};

function authorize(role, action) {
  return permissions[action]?.includes(role);
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const user = users[req.headers["x-user"]];
  if (!user) return send(res, 401, { error: "unauthenticated" });
  if (req.method === "GET" && req.url === "/orders") {
    return authorize(user.role, "orders:read") ? send(res, 200, { user, orders: [{ id: "o-100", status: "open" }] }) : send(res, 403, { error: "forbidden" });
  }
  if (req.method === "POST" && req.url === "/orders/o-100/cancel") {
    return authorize(user.role, "orders:cancel") ? send(res, 200, { user, id: "o-100", status: "canceled" }) : send(res, 403, { error: "forbidden" });
  }
  send(res, 404, { error: "not_found" });
}).listen(4103, () => console.log("security03 listening on http://localhost:4103"));
