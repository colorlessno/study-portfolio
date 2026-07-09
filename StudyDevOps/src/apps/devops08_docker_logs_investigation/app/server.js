import http from 'node:http'

const mode = process.env.APP_MODE ?? 'ok'
if (mode === 'missing-env' && !process.env.REQUIRED_VALUE) {
  console.error(JSON.stringify({ level: 'error', cause: 'missing REQUIRED_VALUE' }))
  process.exit(1)
}

http.createServer((req, res) => {
  if (mode === 'runtime-error') {
    console.error(JSON.stringify({ level: 'error', cause: 'runtime error sample' }))
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error_code: 'runtime_error' }))
    return
  }
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ status: 'ok', mode }))
}).listen(8080, () => console.log(JSON.stringify({ level: 'info', message: 'app listening', mode })))
