import assert from 'node:assert/strict'
import test from 'node:test'

const baseUrl = process.env.APP_BASE_URL ?? 'http://localhost:8080'

test('health and ready endpoints', async () => {
  const health = await fetch(`${baseUrl}/health`)
  assert.equal(health.status, 200)
  assert.equal((await health.json()).status, 'ok')

  const ready = await fetch(`${baseUrl}/ready`)
  assert.equal(ready.status, 200)
  assert.equal((await ready.json()).status, 'ready')
})
