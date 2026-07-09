const { unsafeSearch, safeSearch } = require("./query_builder");

const input = "' or '1'='1";
console.log("unsafe example:", unsafeSearch(input));
console.log("safe example:", JSON.stringify(safeSearch(input, "active")));
