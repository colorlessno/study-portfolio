const http = require("http");

const users = {
  alice: { id: "alice", role: "staff", department: "sales" },
  bob: { id: "bob", role: "staff", department: "support" },
  admin: { id: "admin", role: "admin", department: "hq" },
};
const order = { id: "o-200", department: "sales", status: "draft" };

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
  if (req.method === "GET" && req.url === "/orders/o-200") return canRead(user, order) ? send(res, 200, order) : send(res, 403, { error: "forbidden" });
  if (req.method === "PATCH" && req.url === "/orders/o-200") return canUpdate(user, order) ? send(res, 200, { ...order, note: "updated" }) : send(res, 403, { error: "forbidden" });
  send(res, 404, { error: "not_found" });
}).listen(4104, () => console.log("security04 listening on http://localhost:4104"));
