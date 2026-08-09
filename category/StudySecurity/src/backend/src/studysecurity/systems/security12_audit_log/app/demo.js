const assert = require("assert");
const { audit } = require("./audit_logger");

const success = audit({ actor: "u-demo", action: "order.cancel", target: "order:o-100", result: "success", requestId: "req-1" });
const denied = audit({ actor: "u-viewer", action: "credential.rotate", target: "credential:example-api-token", result: "denied", reason: "role denied for demo@example.com", requestId: "req-2" });

assert.strictEqual(success.result, "success");
assert.strictEqual(denied.target, "credential:[secret]");
assert.strictEqual(denied.reason, "role denied for [email]");
