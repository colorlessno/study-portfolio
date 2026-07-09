const http = require('http');
const users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }];
const tasks = [{ userId: 1, title: 't1' }, { userId: 1, title: 't2' }, { userId: 2, title: 't3' }];
function send(res, body) { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
http.createServer((req, res) => {
  const mode = new URL(req.url, 'http://localhost').searchParams.get('mode') || 'n_plus_one';
  let queries = 1;
  let result;
  if (mode === 'optimized') {
    queries = 2;
    result = users.map((u) => ({ ...u, tasks: tasks.filter((t) => t.userId === u.id) }));
  } else {
    result = users.map((u) => { queries += 1; return { ...u, tasks: tasks.filter((t) => t.userId === u.id) }; });
  }
  send(res, { mode, queries, result });
}).listen(3050, () => console.log('web50 http://localhost:3050/?mode=n_plus_one'));
