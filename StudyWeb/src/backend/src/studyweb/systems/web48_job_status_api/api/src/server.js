const http = require('http');
const jobs = new Map();
function send(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/jobs') {
    const id = `job_${Date.now()}`;
    jobs.set(id, { id, status: 'queued' });
    setTimeout(() => jobs.set(id, { id, status: 'running' }), 300);
    setTimeout(() => jobs.set(id, { id, status: 'succeeded', result: 'done' }), 900);
    return send(res, 202, { id, status: 'queued' });
  }
  const match = req.url.match(/^\/jobs\/(.+)$/);
  if (req.method === 'GET' && match) return send(res, jobs.has(match[1]) ? 200 : 404, jobs.get(match[1]) || { error: 'not_found' });
  return send(res, 404, { error: 'not_found' });
}).listen(3048, () => console.log('web48 http://localhost:3048'));
