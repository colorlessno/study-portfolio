const http = require("http");

const users = {
  alice: { id: "alice", role: "staff", department: "sales" },
  bob: { id: "bob", role: "staff", department: "support" },
  admin: { id: "admin", role: "admin", department: "hq" },
};
const orders = {
  "o-200": { id: "o-200", department: "sales", status: "draft" },
  "o-201": { id: "o-201", department: "support", status: "confirmed" },
};

function canRead(user, target) {
  return user.role === "admin" || user.department === target.department;
}

function canUpdate(user, target) {
  return canRead(user, target) && target.status === "draft";
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  const user = users[req.headers["x-user"]];
  if (!user) return send(res, 401, { error: "unauthenticated" });
  const match = req.url.match(/^\/orders\/(o-\d+)$/);
  const order = match ? orders[match[1]] : undefined;
  if (match && !order) return send(res, 404, { error: "not_found" });
  if (req.method === "GET" && order) return canRead(user, order) ? send(res, 200, order) : send(res, 403, { error: "forbidden" });
  if (req.method === "PATCH" && order) return canUpdate(user, order) ? send(res, 200, { ...order, note: "updated" }) : send(res, 403, { error: "forbidden" });
  send(res, 404, { error: "not_found" });
}).listen(4104, () => console.log("security04 listening on http://localhost:4104"));
