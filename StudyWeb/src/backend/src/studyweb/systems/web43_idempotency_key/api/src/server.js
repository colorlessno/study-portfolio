const http = require('http');
const results = new Map();
const created = [];
function send(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
function read(req) { return new Promise((resolve) => { let d = ''; req.on('data', (c) => { d += c; }); req.on('end', () => resolve(d)); }); }
http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/orders') return send(res, 404, { error: 'not_found' });
  const key = req.headers['idempotency-key'];
  if (!key) return send(res, 400, { error: 'idempotency_key_required' });
  if (results.has(key)) return send(res, 200, { replay: true, result: results.get(key), count: created.length });
  const body = JSON.parse(await read(req) || '{}');
  const result = { id: created.length + 1, name: body.name || 'order' };
  created.push(result);
  results.set(key, result);
  send(res, 201, { replay: false, result, count: created.length });
}).listen(3043, () => console.log('web43 http://localhost:3043/orders'));
