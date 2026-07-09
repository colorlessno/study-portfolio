function mask(value) {
  return String(value).replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+/gi, "[email]").replace(/example-[a-z-]+/g, "[secret]");
}

function audit(event) {
  const record = {
    at: new Date().toISOString(),
    actor: event.actor,
    action: event.action,
    target: event.target,
    result: event.result,
    reason: mask(event.reason || ""),
    requestId: event.requestId,
  };
  console.log(JSON.stringify(record));
}

module.exports = { audit, mask };
