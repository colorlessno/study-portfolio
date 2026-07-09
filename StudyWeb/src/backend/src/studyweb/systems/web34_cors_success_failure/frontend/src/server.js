const http = require('http');
const html = `<!doctype html><meta charset="utf-8"><title>web34</title>
<h1>CORS</h1><button id="call">call backend</button><pre id="out"></pre>
<script>
call.onclick=async()=>{try{const r=await fetch('http://localhost:3035/api/message',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});out.textContent=await r.text();}catch(e){out.textContent=e.message;}};
</script>`;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}).listen(3034, () => console.log('web34 frontend http://localhost:3034'));
