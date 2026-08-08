import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const studyAwsRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const systemsRoot = path.join(studyAwsRoot, 'src', 'backend', 'src', 'studyaws', 'systems')
const supportedTopics = Array.from({ length: 10 }, (_, index) => `aws${String(index + 1).padStart(2, '0')}`)
const requestedTopics = process.argv.slice(2)

for (const topic of requestedTopics) {
  if (!supportedTopics.includes(topic)) {
    throw new Error(`Unknown topic: ${topic}. Choose ${supportedTopics.join(', ')}.`)
  }
}

const shouldValidate = (topic) => requestedTopics.length === 0 || requestedTopics.includes(topic)
const validatedTopics = []

function topicDirectory(topic, name) {
  return path.join(systemsRoot, `${topic}_${name}`)
}

function runNode(args, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd || studyAwsRoot,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    maxBuffer: 8 * 1024 * 1024,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`node ${args.join(' ')} failed\n${output}`)
  }
  return { status: result.status, output }
}

function checkFiles(cwd, ...files) {
  for (const file of files) runNode(['--check', file], { cwd })
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      server.close(() => resolve(address.port))
    })
  })
}

function request(port, requestPath, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body ?? ''
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: requestPath,
      method: options.method || 'GET',
      headers: { ...options.headers, ...(body ? { 'content-length': Buffer.byteLength(body) } : {}) },
      timeout: 1000,
    }, (res) => {
      let responseBody = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { responseBody += chunk })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: responseBody }))
    })
    req.once('timeout', () => req.destroy(new Error('request_timeout')))
    req.once('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function waitUntilReady(port, deadline = Date.now() + 5000) {
  while (Date.now() < deadline) {
    try {
      await request(port, '/')
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw new Error(`server on port ${port} did not become ready within 5 seconds`)
}

async function withServer({ cwd, script, portVariable = 'PORT', env = {} }, verify) {
  const port = await getFreePort()
  const child = spawn(process.execPath, [script], {
    cwd,
    env: { ...process.env, ...env, [portVariable]: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk.toString('utf8') })
  child.stderr.on('data', (chunk) => { output += chunk.toString('utf8') })
  try {
    await waitUntilReady(port)
    await verify(port, () => output)
  } finally {
    child.kill()
    await Promise.race([
      new Promise((resolve) => child.once('exit', resolve)),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
  }
}

function section(title) {
  console.log(`\n[StudyAWS] ${title}`)
}

if (shouldValidate('aws01')) {
  section('aws01 IAM allow and deny decisions')
  const cwd = topicDirectory('aws01', 'iam_basics')
  checkFiles(cwd, 'app/policy_check.js')
  const result = runNode(['app/policy_check.js'], { cwd })
  assert.match(result.output, /s3:GetObject .* => allow/)
  assert.match(result.output, /s3:DeleteObject .* => explicitDeny/)
  assert.match(result.output, /s3:PutObject .* => implicitDeny/)
  validatedTopics.push('aws01')
}

if (shouldValidate('aws02')) {
  section('aws02 public and internal port models')
  const cwd = topicDirectory('aws02', 'security_group_port')
  checkFiles(cwd, 'web/server.js', 'api/server.js')
  await withServer({ cwd, script: 'web/server.js', portVariable: 'WEB_PORT' }, async (port) => {
    const response = await request(port, '/')
    assert.equal(response.status, 200)
    assert.equal(JSON.parse(response.body).service, 'web')
  })
  await withServer({ cwd, script: 'api/server.js', portVariable: 'API_PORT' }, async (port) => {
    const response = await request(port, '/')
    assert.equal(response.status, 200)
    assert.equal(JSON.parse(response.body).internalOnly, true)
  })
  validatedTopics.push('aws02')
}

if (shouldValidate('aws03')) {
  section('aws03 server health and not-found behavior')
  const cwd = topicDirectory('aws03', 'ec2_ssh')
  checkFiles(cwd, 'app/server.js')
  await withServer({ cwd, script: 'app/server.js' }, async (port) => {
    const health = await request(port, '/health')
    assert.equal(health.status, 200)
    assert.equal(JSON.parse(health.body).ok, true)
    assert.equal((await request(port, '/missing')).status, 404)
  })
  validatedTopics.push('aws03')
}

if (shouldValidate('aws04')) {
  section('aws04 separated and masked database configuration')
  const cwd = topicDirectory('aws04', 'rds_connection')
  checkFiles(cwd, 'app/db_check.js')
  const env = {
    DB_HOST: '127.0.0.1', DB_PORT: '54324', DB_NAME: 'studyaws',
    DB_USER: 'studyaws', DB_PASSWORD: 'local-example-only',
  }
  const configured = runNode(['app/db_check.js'], { cwd, env })
  const config = JSON.parse(configured.output)
  assert.deepEqual(config.missing, [])
  assert.equal(config.connection.password, 'masked')
  const missing = runNode(['app/db_check.js'], {
    cwd,
    env: Object.fromEntries(Object.keys(env).map((key) => [key, ''])),
    allowFailure: true,
  })
  assert.notEqual(missing.status, 0)
  validatedTopics.push('aws04')
}

if (shouldValidate('aws05')) {
  section('aws05 local object storage and unsafe key rejection')
  const cwd = topicDirectory('aws05', 's3_file_storage')
  checkFiles(cwd, 'app/storage.js')
  const result = runNode(['app/storage.js'], { cwd })
  assert.match(result.output, /docs\/sample\.txt/)
  assert.match(result.output, /blocked invalid_object_key/)
  validatedTopics.push('aws05')
}

if (shouldValidate('aws06')) {
  section('aws06 structured logs and request correlation')
  const cwd = topicDirectory('aws06', 'cloudwatch_logs')
  checkFiles(cwd, 'app/server.js')
  await withServer({ cwd, script: 'app/server.js' }, async (port, output) => {
    const ok = await request(port, '/', { headers: { 'x-request-id': 'validation-ok' } })
    assert.equal(ok.status, 200)
    assert.equal(JSON.parse(ok.body).requestId, 'validation-ok')
    const error = await request(port, '/error', { headers: { 'x-request-id': 'validation-error' } })
    assert.equal(error.status, 500)
    assert.equal(error.headers['x-request-id'], 'validation-error')
    await new Promise((resolve) => setTimeout(resolve, 20))
    assert.match(output(), /"level":"error".*"requestId":"validation-error"/)
  })
  validatedTopics.push('aws06')
}

if (shouldValidate('aws07')) {
  section('aws07 local Lambda invocation')
  const cwd = topicDirectory('aws07', 'lambda_local_api')
  checkFiles(cwd, 'src/handler.js', 'scripts/local_invoke.js')
  const result = runNode(['scripts/local_invoke.js'], { cwd })
  const response = JSON.parse(result.output)
  assert.equal(response.statusCode, 200)
  assert.equal(JSON.parse(response.body).message, 'hello StudyAWS')
  validatedTopics.push('aws07')
}

if (shouldValidate('aws08')) {
  section('aws08 API Gateway event mapping and Lambda responses')
  const cwd = topicDirectory('aws08', 'api_gateway_lambda')
  checkFiles(cwd, 'src/handler.js', 'scripts/local_api.js')
  await withServer({ cwd, script: 'scripts/local_api.js' }, async (port) => {
    const list = await request(port, '/items')
    assert.equal(list.status, 200)
    assert.equal(JSON.parse(list.body).items.length, 1)
    const created = await request(port, '/items', {
      method: 'POST', body: JSON.stringify({ name: 'validation' }),
      headers: { 'content-type': 'application/json' },
    })
    assert.equal(created.status, 201)
    assert.equal((await request(port, '/items', { method: 'POST', body: '{' })).status, 400)
    assert.equal((await request(port, '/missing')).status, 404)
  })
  validatedTopics.push('aws08')
}

if (shouldValidate('aws09')) {
  section('aws09 deployable service health and environment configuration')
  const cwd = topicDirectory('aws09', 'simple_deploy')
  checkFiles(cwd, 'app/server.js')
  await withServer({ cwd, script: 'app/server.js', env: { APP_NAME: 'studyaws-validation' } }, async (port) => {
    const health = await request(port, '/health')
    assert.equal(health.status, 200)
    assert.deepEqual(JSON.parse(health.body), { ok: true, appName: 'studyaws-validation' })
  })
  validatedTopics.push('aws09')
}

if (shouldValidate('aws10')) {
  section('aws10 isolated backup, dry-run, and restore')
  const cwd = topicDirectory('aws10', 'backup_restore')
  checkFiles(cwd, 'scripts/backup.js', 'scripts/restore.js')
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'studyaws-backup-'))
  const temporaryData = path.join(temporaryRoot, 'data')
  fs.mkdirSync(temporaryData)
  const source = path.join(cwd, 'data', 'sample.json')
  const target = path.join(temporaryData, 'sample.json')
  const original = fs.readFileSync(source, 'utf8')
  fs.writeFileSync(target, original, 'utf8')
  try {
    const env = { STUDYAWS_BACKUP_ROOT: temporaryRoot }
    runNode(['scripts/backup.js'], { cwd, env })
    assert.equal(fs.readdirSync(path.join(temporaryRoot, 'backups')).length, 1)
    fs.writeFileSync(target, '{"orders":[]}', 'utf8')
    runNode(['scripts/restore.js', '--dry-run'], { cwd, env })
    assert.equal(fs.readFileSync(target, 'utf8'), '{"orders":[]}')
    runNode(['scripts/restore.js'], { cwd, env })
    assert.equal(fs.readFileSync(target, 'utf8'), original)
  } finally {
    if (path.basename(temporaryRoot).startsWith('studyaws-backup-')) {
      fs.rmSync(temporaryRoot, { recursive: true, force: true })
    }
  }
  validatedTopics.push('aws10')
}

console.log(`\nStudyAWS validation passed: ${validatedTopics.join(', ')}`)
