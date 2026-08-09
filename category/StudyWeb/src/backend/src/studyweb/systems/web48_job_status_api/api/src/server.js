"use strict";

const { randomUUID } = require("node:crypto");
const http = require("node:http");

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function createJobController({
  jobs = new Map(),
  createJobId = () => `job_${randomUUID()}`,
  schedule = setTimeout,
} = {}) {
  return {
    create() {
      const id = createJobId();
      jobs.set(id, { id, status: "queued" });
      schedule(() => jobs.set(id, { id, status: "running" }), 300);
      schedule(() => jobs.set(id, { id, status: "succeeded", result: "done" }), 900);
      return jobs.get(id);
    },
    get(id) {
      return jobs.get(id);
    },
  };
}

function createServer({ controller = createJobController() } = {}) {
  return http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/jobs") {
      return send(res, 202, controller.create());
    }
    const match = req.url.match(/^\/jobs\/([^/]+)$/);
    if (req.method === "GET" && match) {
      const job = controller.get(match[1]);
      return send(res, job ? 200 : 404, job || { error: "not_found" });
    }
    return send(res, 404, { error: "not_found" });
  });
}

if (require.main === module) {
  createServer().listen(3048, () => console.log("web48 http://localhost:3048"));
}

module.exports = { createJobController, createServer };
