const { audit } = require("./audit_logger");

audit({ actor: "u-demo", action: "order.cancel", target: "order:o-100", result: "success", requestId: "req-1" });
audit({ actor: "u-viewer", action: "order.cancel", target: "order:o-100", result: "denied", reason: "role denied for demo@example.com", requestId: "req-2" });
