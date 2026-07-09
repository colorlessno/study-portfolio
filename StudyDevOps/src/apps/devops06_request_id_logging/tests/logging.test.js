import assert from 'node:assert/strict'
import test from 'node:test'

test('request id is returned', async () => {
  const res = await fetch('http://localhost:8080/ok', { headers: { 'X-Request-Id': 'req-test' } })
  assert.equal(res.headers.get('x-request-id'), 'req-test')
  assert.equal(res.status, 200)
})
