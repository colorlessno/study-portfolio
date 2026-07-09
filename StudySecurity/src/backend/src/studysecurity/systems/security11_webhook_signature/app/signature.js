const crypto = require("crypto");
const secret = "example-webhook-secret";

function sign(timestamp, body) {
  return crypto.createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
}

function verify(timestamp, body, signature) {
  const expected = sign(timestamp, body);
  const actual = signature || "";
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

module.exports = { sign, verify };
