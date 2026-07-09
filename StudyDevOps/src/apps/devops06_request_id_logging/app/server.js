import crypto from 'node:crypto'
import http from 'node:http'
import { log } from './logger.js'

const server = http.createServer((req, res) => {
  const started = Date.now()
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID()
  res.setHeader('X-Request-Id', requestId)
  log({ level: 'info', request_id: requestId, action: 'request_started', method: req.method, path: req.url })
  try {
    if (req.url === '/fail') throw new Error('sample failure')
    const body = req.url === '/health' ? { status: 'ok' } : { ok: true }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(body))
    log({ level: 'info', request_id: requestId, action: 'request_completed', status: 200, duration_ms: Date.now() - started })
  } catch (error) {
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error_code: 'sample_failure' }))
    log({ level: 'error', request_id: requestId, action: 'request_failed', status: 500, message: error.message, duration_ms: Date.now() - started })
  }
})

server.listen(8080, () => console.log('logging api listening on 8080'))
