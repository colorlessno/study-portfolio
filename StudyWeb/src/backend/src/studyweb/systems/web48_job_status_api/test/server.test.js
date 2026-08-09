"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const { after, before, test } = require("node:test");
const { createJobController, createServer } = require("../api/src/server");

let server;
let port;
const scheduled = [];

before(async () => {
  const controller = createJobController({
    createJobId: () => "job_test",
    schedule: (callback, delay) => scheduled.push({ callback, delay }),
  });
  server = createServer({ controller });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  port = server.address().port;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

function request(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on("error", reject);
    req.end();
  });
}

test("job moves from queued to running to succeeded", async () => {
  const created = await request("/jobs", "POST");
  assert.deepEqual(created, { status: 202, body: { id: "job_test", status: "queued" } });
  assert.deepEqual(scheduled.map((entry) => entry.delay), [300, 900]);

  assert.deepEqual(await request("/jobs/job_test"), {
    status: 200,
    body: { id: "job_test", status: "queued" },
  });

  scheduled.find((entry) => entry.delay === 300).callback();
  assert.deepEqual((await request("/jobs/job_test")).body, { id: "job_test", status: "running" });

  scheduled.find((entry) => entry.delay === 900).callback();
  assert.deepEqual((await request("/jobs/job_test")).body, {
    id: "job_test",
    status: "succeeded",
    result: "done",
  });
});

test("unknown job returns 404", async () => {
  assert.deepEqual(await request("/jobs/missing"), {
    status: 404,
    body: { error: "not_found" },
  });
});

test("unknown route returns 404", async () => {
  assert.deepEqual(await request("/unknown"), {
    status: 404,
    body: { error: "not_found" },
  });
});
