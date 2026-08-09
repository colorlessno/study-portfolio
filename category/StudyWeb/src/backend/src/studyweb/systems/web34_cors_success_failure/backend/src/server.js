const http = require('http');
const allowCors = process.env.ALLOW_CORS === '1';

function headers() {
  return allowCors ? {
    'Access-Control-Allow-Origin': 'http://localhost:3034',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  } : {};
}

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers());
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'application/json', ...headers() });
  res.end(JSON.stringify({ message: 'backend response', cors: allowCors }));
}).listen(3035, () => console.log(`web34 backend http://localhost:3035 cors=${allowCors}`));
