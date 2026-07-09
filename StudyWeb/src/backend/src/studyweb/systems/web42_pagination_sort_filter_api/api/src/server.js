const http = require('http');
const url = require('url');
const items = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}`, status: i % 2 ? 'open' : 'closed', createdAt: `2026-04-${String((i % 28) + 1).padStart(2, '0')}` }));
function send(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/items') return send(res, 404, { error: 'not_found' });
  const q = parsed.query;
  const limit = Math.min(Math.max(Number(q.limit || 10), 1), 50);
  const offset = Math.max(Number(q.offset || 0), 0);
  if (q.order && !['asc', 'desc'].includes(q.order)) return send(res, 400, { error: 'invalid_order' });
  let list = items.filter((x) => (!q.keyword || x.name.toLowerCase().includes(String(q.keyword).toLowerCase())) && (!q.status || x.status === q.status));
  if (q.sort) list.sort((a, b) => String(a[q.sort] || '').localeCompare(String(b[q.sort] || '')) * (q.order === 'desc' ? -1 : 1));
  send(res, 200, { items: list.slice(offset, offset + limit), meta: { total: list.length, limit, offset } });
}).listen(3042, () => console.log('web42 http://localhost:3042/items'));
