import http from 'node:http'

const items = []

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { status: 'ok' })
  if (req.method === 'GET' && req.url === '/items') return send(res, 200, { items })
  if (req.method === 'POST' && req.url === '/items') {
    let raw = ''
    req.on('data', (chunk) => { raw += chunk })
    req.on('end', () => {
      const body = raw ? JSON.parse(raw) : {}
      if (!body.name) return send(res, 400, { error_code: 'name_required' })
      const item = { id: `item-${items.length + 1}`, name: String(body.name) }
      items.push(item)
      return send(res, 201, item)
    })
    return
  }
  return send(res, 404, { error_code: 'not_found' })
})

server.listen(8080, () => console.log('api listening on 8080'))
