const http = require('http');

function json(res, status, body, requestId) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Study-Request-Id': requestId,
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
  });
}

const html = `<!doctype html><meta charset="utf-8"><title>web32</title>
<h1>HTTP headers</h1>
<button id="get">GET</button><button id="post">POST</button>
<pre id="out"></pre><script src="/client/src/main.js"></script>`;

http.createServer(async (req, res) => {
  const requestId = `req_${Date.now()}`;
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }
  if (req.url === '/client/src/main.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end(`const out=document.querySelector('#out');
document.querySelector('#get').onclick=async()=>out.textContent=await (await fetch('/api/hello',{headers:{'X-Client':'browser'}})).text();
document.querySelector('#post').onclick=async()=>out.textContent=await (await fetch('/api/echo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'hello'})})).text();`);
  }
  if (req.method === 'GET' && req.url === '/api/hello') {
    return json(res, 200, { method: req.method, headers: req.headers }, requestId);
  }
  if (req.method === 'POST' && req.url === '/api/echo') {
    const body = await readBody(req);
    return json(res, 200, { method: req.method, headers: req.headers, body }, requestId);
  }
  return json(res, 404, { error: 'not_found' }, requestId);
}).listen(3032, () => console.log('web32 http://localhost:3032'));
