const http = require('http');
const items = [{ id: 1, name: 'one' }];
function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/items') return send(res, 200, { items });
  if (req.method === 'POST' && req.url === '/items') return send(res, 201, { id: 2, name: 'created' });
  if (req.url === '/bad-request') return send(res, 400, { error: { code: 'VALIDATION_ERROR', message: 'invalid input' } });
  if (req.url === '/private') return send(res, 401, { error: { code: 'UNAUTHORIZED', message: 'login required' } });
  if (req.url === '/admin') return send(res, 403, { error: { code: 'FORBIDDEN', message: 'permission required' } });
  if (req.url === '/items/999') return send(res, 404, { error: { code: 'NOT_FOUND', message: 'item not found' } });
  if (req.url === '/duplicate') return send(res, 409, { error: { code: 'CONFLICT', message: 'already exists' } });
  if (req.url === '/error') return send(res, 500, { error: { code: 'INTERNAL_ERROR', message: 'unexpected error' } });
  return send(res, 404, { error: { code: 'NOT_FOUND', message: 'route not found' } });
}).listen(3035, () => console.log('web35 http://localhost:3035'));
