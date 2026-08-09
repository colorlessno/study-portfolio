import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const studyBaseRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const repositoryRoot = path.dirname(studyBaseRoot)
const samplesRoot = path.join(studyBaseRoot, 'src', 'samples')
const templatesRoot = path.join(studyBaseRoot, 'doc', 'templates')
const supportedTopics = Array.from({ length: 12 }, (_, index) => `base${String(index + 1).padStart(2, '0')}`)
const requestedTopics = process.argv.slice(2)

for (const topic of requestedTopics) {
  if (!supportedTopics.includes(topic)) {
    throw new Error(`Unknown topic: ${topic}. Choose ${supportedTopics.join(', ')}.`)
  }
}

const shouldValidate = (topic) => requestedTopics.length === 0 || requestedTopics.includes(topic)
const validatedTopics = []

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || studyBaseRoot,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    maxBuffer: 8 * 1024 * 1024,
  })
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}${result.error ? `${result.error.message}\n` : ''}`
  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\n${output}`)
  }
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '', output }
}

function runNpm(args, options = {}) {
  if (process.platform === 'win32') {
    const command = ['npm.cmd', ...args].join(' ')
    return run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', command], options)
  }
  return run('npm', args, options)
}

function assertFiles(root, files) {
  for (const relativePath of files) {
    const target = path.join(root, relativePath)
    assert.equal(fs.existsSync(target), true, `missing ${target}`)
    assert.ok(fs.statSync(target).size > 0, `empty ${target}`)
  }
}

function section(title) {
  console.log(`\n[StudyBase] ${title}`)
}

function withTemporaryCopy(prefix, source, exercise) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix))
  const worktree = path.join(temporaryRoot, 'practice')
  fs.cpSync(source, worktree, { recursive: true })
  try {
    exercise(worktree)
  } finally {
    if (path.dirname(temporaryRoot) === os.tmpdir() && path.basename(temporaryRoot).startsWith(prefix)) {
      fs.rmSync(temporaryRoot, { recursive: true, force: true })
    }
  }
}

function initializeGit(worktree) {
  run('git', ['init', '-b', 'main'], { cwd: worktree })
  run('git', ['config', 'user.name', 'StudyBase Validation'], { cwd: worktree })
  run('git', ['config', 'user.email', 'studybase@example.invalid'], { cwd: worktree })
  run('git', ['add', '.'], { cwd: worktree })
  run('git', ['commit', '-m', 'Initial practice state'], { cwd: worktree })
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
      hostname: '127.0.0.1', port, path: requestPath,
      method: options.method || 'GET',
      headers: { ...options.headers, ...(body ? { 'content-length': Buffer.byteLength(body) } : {}) },
      timeout: 1000,
    }, (res) => {
      let responseBody = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => { responseBody += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body: responseBody }))
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
      await request(port, '/health')
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
  throw new Error(`server on port ${port} did not become ready within 5 seconds`)
}

async function withApiServer(cwd, verify) {
  const port = await getFreePort()
  const child = spawn(process.execPath, ['src/server.js'], {
    cwd,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  try {
    await waitUntilReady(port)
    await verify(port)
  } finally {
    child.kill()
    await Promise.race([
      new Promise((resolve) => child.once('exit', resolve)),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
  }
}

if (shouldValidate('base01')) {
  section('base01 ambiguous request evidence and templates')
  assertFiles(path.join(samplesRoot, 'base01_ambiguous_request_hearing'), ['ambiguous_request_case.md', 'completed_hearing_note.md'])
  assertFiles(path.join(templatesRoot, 'base01_ambiguous_request_hearing'), ['request_hearing_note.md', 'requirement_input_summary.md'])
  validatedTopics.push('base01')
}

if (shouldValidate('base02')) {
  section('base02 provisional deliverable evidence and templates')
  assertFiles(path.join(samplesRoot, 'base02_incomplete_information_deliverable'), ['incomplete_case.md', 'completed_provisional_deliverable.md'])
  assertFiles(path.join(templatesRoot, 'base02_incomplete_information_deliverable'), ['assumption_list.md', 'deliverable_limitation_note.md', 'provisional_deliverable.md', 'unknown_issues_list.md'])
  validatedTopics.push('base02')
}

if (shouldValidate('base03')) {
  section('base03 estimate evidence and templates')
  assertFiles(path.join(samplesRoot, 'base03_estimate_basis'), ['estimate_case.md', 'completed_estimate_basis.md'])
  assertFiles(path.join(templatesRoot, 'base03_estimate_basis'), ['estimate_basis.md', 'risk_list.md', 'work_breakdown.md'])
  validatedTopics.push('base03')
}

if (shouldValidate('base04')) {
  section('base04 test precondition evidence and templates')
  assertFiles(path.join(samplesRoot, 'base04_test_precondition_checklist'), ['test_precondition_case.md', 'completed_test_precondition_checklist.md'])
  assertFiles(path.join(templatesRoot, 'base04_test_precondition_checklist'), ['test_data_check.md', 'test_environment_check.md', 'test_precondition_checklist.md'])
  validatedTopics.push('base04')
}

if (shouldValidate('base05')) {
  section('base05 responsibility evidence and templates')
  assertFiles(path.join(samplesRoot, 'base05_raci_responsibility_matrix'), ['responsibility_case.md', 'completed_raci_matrix.md'])
  assertFiles(path.join(templatesRoot, 'base05_raci_responsibility_matrix'), ['decision_pending_list.md', 'escalation_note.md', 'raci_matrix.md'])
  validatedTopics.push('base05')
}

if (shouldValidate('base06')) {
  section('base06 isolated Git status and diff practice')
  const source = path.join(samplesRoot, 'base06_git_basic', 'practice_repo')
  withTemporaryCopy('studybase-git-basic-', source, (worktree) => {
    initializeGit(worktree)
    fs.appendFileSync(path.join(worktree, 'notes.txt'), 'Line 3: validation change\n', 'utf8')
    const status = run('git', ['status', '--short'], { cwd: worktree })
    const diff = run('git', ['diff', '--', 'notes.txt'], { cwd: worktree })
    assert.match(status.output, /M notes\.txt/)
    assert.match(diff.output, /validation change/)
  })
  validatedTopics.push('base06')
}

if (shouldValidate('base07')) {
  section('base07 isolated branch conflict and resolution')
  const source = path.join(samplesRoot, 'base07_branch_merge_conflict', 'practice_repo')
  withTemporaryCopy('studybase-git-conflict-', source, (worktree) => {
    initializeGit(worktree)
    const target = path.join(worktree, 'conflict_target.txt')
    run('git', ['switch', '-c', 'feature/a'], { cwd: worktree })
    fs.writeFileSync(target, 'Title: Conflict Practice\nDecision: feature choice\nFooter: keep this line\n', 'utf8')
    run('git', ['add', 'conflict_target.txt'], { cwd: worktree })
    run('git', ['commit', '-m', 'Change target on feature'], { cwd: worktree })
    run('git', ['switch', 'main'], { cwd: worktree })
    fs.writeFileSync(target, 'Title: Conflict Practice\nDecision: main choice\nFooter: keep this line\n', 'utf8')
    run('git', ['add', 'conflict_target.txt'], { cwd: worktree })
    run('git', ['commit', '-m', 'Change target on main'], { cwd: worktree })
    const merge = run('git', ['merge', 'feature/a'], { cwd: worktree, allowFailure: true })
    assert.notEqual(merge.status, 0)
    assert.match(fs.readFileSync(target, 'utf8'), /<<<<<<< HEAD/)
    fs.writeFileSync(target, 'Title: Conflict Practice\nDecision: combined choice\nFooter: keep this line\n', 'utf8')
    run('git', ['add', 'conflict_target.txt'], { cwd: worktree })
    run('git', ['commit', '-m', 'Resolve practice conflict'], { cwd: worktree })
    const finalStatus = run('git', ['status', '--short'], { cwd: worktree })
    assert.equal(finalStatus.status, 0)
    assert.equal(finalStatus.stdout.trim(), '')
  })
  validatedTopics.push('base07')
}

if (shouldValidate('base08')) {
  section('base08 issue, PR, review response, and local Gitea lab')
  assertFiles(path.join(samplesRoot, 'base08_issue_branch_pr_merge'), ['sample_issue.md', 'sample_pull_request.md', 'sample_review_response.md'])
  assertFiles(path.join(templatesRoot, 'base08_issue_branch_pr_merge'), ['issue_template.md', 'pull_request_template.md', 'review_response_note.md'])
  const lab = path.join(samplesRoot, 'base08_issue_branch_pr_merge', 'gitea_lab')
  assertFiles(lab, ['README.md', 'docker-compose.yml', 'review_scenario.md', 'seed_repository/README.md', 'seed_repository/docs/team-workflow.md', 'seed_repository/scripts/check-workflow.mjs'])
  const compose = fs.readFileSync(path.join(lab, 'docker-compose.yml'), 'utf8')
  assert.match(compose, /127\.0\.0\.1:3418:3000/, 'Gitea Web UI must bind to localhost only')
  assert.match(compose, /gitea_data:\/data/, 'Gitea must use an isolated named volume')
  validatedTopics.push('base08')
}

if (shouldValidate('base09')) {
  section('base09 npm dev, build, test, and start scripts')
  const cwd = path.join(samplesRoot, 'base09_npm_scripts', 'sample_node_project')
  assert.match(runNpm(['run', 'dev'], { cwd }).output, /npm script practice: dev/)
  runNpm(['run', 'build'], { cwd })
  assert.match(runNpm(['test'], { cwd }).output, /smoke test passed/)
  assert.match(runNpm(['start'], { cwd }).output, /npm script practice: start/)
  validatedTopics.push('base09')
}

if (shouldValidate('base10')) {
  section('base10 direct API success and failure responses')
  const cwd = path.join(samplesRoot, 'base10_curl_api_check', 'sample_api')
  run(process.execPath, ['--check', 'src/server.js'], { cwd })
  await withApiServer(cwd, async (port) => {
    assert.equal((await request(port, '/health')).status, 200)
    assert.equal(JSON.parse((await request(port, '/items')).body).items.length, 1)
    assert.equal((await request(port, '/items', { method: 'POST', body: JSON.stringify({ name: 'validation' }), headers: { 'content-type': 'application/json' } })).status, 201)
    assert.equal((await request(port, '/items', { method: 'POST', body: '{' })).status, 400)
    assert.equal((await request(port, '/private')).status, 401)
    assert.equal((await request(port, '/private', { headers: { authorization: 'Bearer studybase' } })).status, 200)
    assert.equal((await request(port, '/forbidden')).status, 403)
    assert.equal((await request(port, '/error')).status, 500)
    assert.equal((await request(port, '/missing')).status, 404)
  })
  validatedTopics.push('base10')
}

if (shouldValidate('base11')) {
  section('base11 portfolio demo evidence set')
  const docs = path.join(studyBaseRoot, 'doc', 'learning_notes', 'base11_portfolio_demo_presentation', 'docs')
  assertFiles(docs, ['demo_script_60s.md', 'demo_script_3min.md', 'demo_script_5min.md', 'evidence_selection.md', 'limitation_note.md', 'target_selection.md', 'video_structure.md'])
  validatedTopics.push('base11')
}

if (shouldValidate('base12')) {
  section('base12 canonical StudyArchitecture arch01 route')
  const canonical = path.join(repositoryRoot, 'StudyArchitecture', 'doc', 'learning_notes', 'arch01_system_anatomy_walkthrough')
  assertFiles(canonical, ['README.md', 'docs/context_container_component.md', 'docs/evidence_vs_inference.md', 'docs/request_data_flow.md'])
  validatedTopics.push('base12')
}

console.log(`\nStudyBase validation passed: ${validatedTopics.join(', ')}`)
