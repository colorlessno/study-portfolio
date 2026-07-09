import http from 'node:http'

let dependencyOk = true

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { status: 'ok' })
  if (req.method === 'GET' && req.url === '/ready') {
    return send(res, dependencyOk ? 200 : 503, {
      status: dependencyOk ? 'ready' : 'not_ready',
      dependencies: { sample_dependency: dependencyOk ? 'ok' : 'failed' },
    })
  }
  if (req.method === 'POST' && req.url === '/toggle-dependency') {
    dependencyOk = !dependencyOk
    return send(res, 200, { dependency_ok: dependencyOk })
  }
  return send(res, 404, { error_code: 'not_found' })
}).listen(8080, () => console.log('health api listening on 8080'))
