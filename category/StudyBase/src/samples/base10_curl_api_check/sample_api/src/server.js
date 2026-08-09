const http = require('http');

const items = [{ id: 1, name: 'sample item' }];

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET' && req.url === '/items') {
    return sendJson(res, 200, { items });
  }

  if (req.method === 'POST' && req.url === '/items') {
    const raw = await readBody(req);
    let body;
    try {
      body = JSON.parse(raw || '{}');
    } catch {
      return sendJson(res, 400, { error: 'invalid_json' });
    }
    if (!body.name) {
      return sendJson(res, 400, { error: 'name_required' });
    }
    const item = { id: items.length + 1, name: body.name };
    items.push(item);
    return sendJson(res, 201, { item });
  }

  if (req.method === 'GET' && req.url === '/private') {
    if (req.headers.authorization !== 'Bearer studybase') {
      return sendJson(res, 401, { error: 'unauthorized' });
    }
    return sendJson(res, 200, { message: 'private ok' });
  }

  if (req.method === 'GET' && req.url === '/forbidden') {
    return sendJson(res, 403, { error: 'forbidden' });
  }

  if (req.method === 'GET' && req.url === '/error') {
    return sendJson(res, 500, { error: 'server_error_sample' });
  }

  return sendJson(res, 404, { error: 'not_found' });
});

const port = Number(process.env.PORT || 3010);
server.listen(port, () => {
  console.log(`sample api listening on http://localhost:${port}`);
});
