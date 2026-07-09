const http = require('http');
const sessions = new Map();

function parseCookie(header = '') {
  return Object.fromEntries(header.split(';').filter(Boolean).map((v) => {
    const [key, ...rest] = v.trim().split('=');
    return [key, rest.join('=')];
  }));
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

const html = `<!doctype html><meta charset="utf-8"><title>web33</title>
<h1>Cookie / Session</h1><button id="login">login</button><button id="me">me</button><button id="logout">logout</button><pre id="out"></pre>
<script>
const out=document.querySelector('#out');
async function call(path,method='GET'){const r=await fetch(path,{method,credentials:'include'});out.textContent=r.status+' '+await r.text();}
login.onclick=()=>call('/login','POST'); me.onclick=()=>call('/me'); logout.onclick=()=>call('/logout','POST');
</script>`;

http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }
  if (req.method === 'POST' && req.url === '/login') {
    const sid = `sid_${Date.now()}`;
    sessions.set(sid, { userId: 'user01', name: 'Study User' });
    return send(res, 200, { ok: true }, { 'Set-Cookie': `sid=${sid}; HttpOnly; SameSite=Lax; Path=/` });
  }
  if (req.method === 'GET' && req.url === '/me') {
    const sid = parseCookie(req.headers.cookie).sid;
    const session = sessions.get(sid);
    return session ? send(res, 200, { user: session }) : send(res, 401, { error: 'not_logged_in' });
  }
  if (req.method === 'POST' && req.url === '/logout') {
    const sid = parseCookie(req.headers.cookie).sid;
    sessions.delete(sid);
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/' });
  }
  return send(res, 404, { error: 'not_found' });
}).listen(3033, () => console.log('web33 http://localhost:3033'));
