const http = require('http');
let temporaryCount = 0;
function send(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
http.createServer((req, res) => {
  const mode = new URL(req.url, 'http://localhost').searchParams.get('mode') || 'success';
  if (mode === 'slow') return setTimeout(() => send(res, 200, { mode, message: 'slow response' }), 2000);
  if (mode === 'temporary') {
    temporaryCount += 1;
    return temporaryCount % 3 ? send(res, 503, { mode, retryable: true }) : send(res, 200, { mode, recovered: true });
  }
  if (mode === 'permanent') return send(res, 400, { mode, retryable: false });
  return send(res, 200, { mode: 'success' });
}).listen(3049, () => console.log('web49 http://localhost:3049/?mode=success'));
