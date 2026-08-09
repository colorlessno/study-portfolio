"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { sign, verify } = require("../app/signature");
const { ACCEPTANCE_WINDOW_MS, validateWebhook } = require("../app/webhook");

const NOW = 1_800_000_000_000;
const BODY = JSON.stringify({ event: "order.created" });

function signedInput(overrides = {}) {
  const timestamp = overrides.timestamp ?? NOW;
  const body = overrides.body ?? BODY;
  return {
    timestamp,
    body,
    signature: overrides.signature ?? sign(timestamp, body),
    eventId: overrides.eventId ?? "evt-001",
  };
}

test("signature is bound to timestamp and raw body", () => {
  const signature = sign(NOW, BODY);
  assert.equal(verify(NOW, BODY, signature), true);
  assert.equal(verify(NOW, `${BODY} `, signature), false);
  assert.equal(verify(NOW + 1, BODY, signature), false);
});

test("valid event is accepted and recorded", () => {
  const seen = new Set();
  assert.deepEqual(validateWebhook(signedInput(), { now: NOW, seen }), { status: 200, ok: true });
  assert.equal(seen.has("evt-001"), true);
});

test("timestamp at five minutes is accepted and one millisecond beyond is rejected", () => {
  const boundary = NOW - ACCEPTANCE_WINDOW_MS;
  assert.equal(validateWebhook(signedInput({ timestamp: boundary }), { now: NOW }).status, 200);

  const expired = boundary - 1;
  assert.deepEqual(validateWebhook(signedInput({ timestamp: expired }), { now: NOW }), {
    status: 401,
    error: "timestamp",
  });
});

test("missing event ID is rejected before replay storage", () => {
  const seen = new Set();
  assert.deepEqual(validateWebhook(signedInput({ eventId: " " }), { now: NOW, seen }), {
    status: 400,
    error: "event_id",
  });
  assert.equal(seen.size, 0);
});

test("invalid signature is rejected", () => {
  assert.deepEqual(validateWebhook(signedInput({ signature: "invalid" }), { now: NOW }), {
    status: 401,
    error: "signature",
  });
});

test("a repeated event ID is rejected as replay", () => {
  const seen = new Set(["evt-001"]);
  assert.deepEqual(validateWebhook(signedInput(), { now: NOW, seen }), {
    status: 409,
    error: "replay",
  });
});
