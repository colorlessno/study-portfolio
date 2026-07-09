const fs = require("fs");
const path = require("path");
const { handler } = require("../src/handler");

async function main() {
  const eventPath = path.join(__dirname, "..", "events", "hello.json");
  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  const result = await handler(event, { awsRequestId: "local-001" });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
