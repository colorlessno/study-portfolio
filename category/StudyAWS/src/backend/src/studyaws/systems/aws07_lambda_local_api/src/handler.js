exports.handler = async (event, context = {}) => {
  const name = event.queryStringParameters?.name || "anonymous";
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: `hello ${name}`,
      requestId: context.awsRequestId || "local-request",
      hasBody: Boolean(event.body),
    }),
  };
};
